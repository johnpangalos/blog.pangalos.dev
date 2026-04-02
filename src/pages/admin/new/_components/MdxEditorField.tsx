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
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  UndoRedo,
  InsertCodeBlock,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function MdxEditorField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="overflow-hidden rounded border border-stone-300 dark:border-stone-600">
        <MDXEditor
          ref={editorRef}
          markdown={defaultValue}
          onChange={setValue}
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
                </>
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
}
