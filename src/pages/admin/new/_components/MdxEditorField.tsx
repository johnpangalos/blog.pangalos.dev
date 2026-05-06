import { useRef, useState } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  jsxPlugin,
  frontmatterPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertFrontmatter,
  ListsToggle,
  UndoRedo,
  InsertCodeBlock,
  insertJsx$,
  usePublisher,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { blogJsxComponentDescriptors } from "./jsxComponentDescriptors";

function InsertComponentButton() {
  const insertJsx = usePublisher(insertJsx$);

  return (
    <select
      className="h-8 rounded border border-stone-300 bg-white px-2 text-sm dark:border-stone-600 dark:bg-stone-800"
      value=""
      onChange={(e) => {
        const value = e.target.value;
        if (value === "Tooltip") {
          insertJsx({
            kind: "text",
            name: "Tooltip",
            props: { main: "text", hover: "tooltip" },
          });
        } else if (value === "NerdAlert") {
          insertJsx({ kind: "flow", name: "NerdAlert", props: {} });
        } else if (value === "SpoilerAlert") {
          insertJsx({ kind: "flow", name: "SpoilerAlert", props: {} });
        } else if (value === "YouTube") {
          insertJsx({
            kind: "flow",
            name: "YouTube",
            props: { videoId: "" },
          });
        }
        e.target.value = "";
      }}
    >
      <option value="" disabled>
        + Component
      </option>
      <option value="Tooltip">Tooltip</option>
      <option value="NerdAlert">Nerd Alert</option>
      <option value="SpoilerAlert">Spoiler Alert</option>
      <option value="YouTube">YouTube</option>
    </select>
  );
}

export default function MdxEditorField({
  name,
  defaultValue = "",
  onChange,
}: {
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="overflow-hidden rounded border border-stone-300 dark:border-stone-600">
        <MDXEditor
          ref={editorRef}
          markdown={defaultValue}
          onChange={handleChange}
          contentEditableClassName="prose dark:prose-invert max-w-none min-h-[300px] px-4 py-2"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            tablePlugin(),
            frontmatterPlugin(),
            jsxPlugin({ jsxComponentDescriptors: blogJsxComponentDescriptors }),
            codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                "": "Plain Text",
                js: "JavaScript",
                ts: "TypeScript",
                jsx: "JSX",
                tsx: "TSX",
                css: "CSS",
                html: "HTML",
                json: "JSON",
                bash: "Bash",
                python: "Python",
                rust: "Rust",
                go: "Go",
              },
            }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <CreateLink />
                  <ListsToggle />
                  <InsertTable />
                  <InsertThematicBreak />
                  <InsertCodeBlock />
                  <InsertFrontmatter />
                  <InsertComponentButton />
                </>
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
}
