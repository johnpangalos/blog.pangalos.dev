import { useState, useCallback, useRef, useEffect } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  imagePlugin,
  diffSourcePlugin,
  jsxPlugin,
  GenericJsxEditor,
  insertJsx$,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  ListsToggle,
  UndoRedo,
  CodeToggle,
  InsertCodeBlock,
  InsertImage,
  InsertThematicBreak,
  DiffSourceToggleWrapper,
  Separator,
  markdownShortcutPlugin,
  usePublisher,
  type MDXEditorMethods,
  type JsxComponentDescriptor,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface Frontmatter {
  author: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  categories: string[];
}

function parseCsv(val: string): string[] {
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const COMPONENT_PATH = "../../components";

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "Link",
    kind: "text",
    source: `${COMPONENT_PATH}/Link.astro`,
    defaultExport: true,
    props: [{ name: "to", type: "string", required: true }],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: "Tooltip",
    kind: "text",
    source: `${COMPONENT_PATH}/Tooltip.astro`,
    defaultExport: true,
    props: [{ name: "to", type: "string" }],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: "FootnoteLink",
    kind: "text",
    source: `${COMPONENT_PATH}/FootnoteLink.astro`,
    defaultExport: true,
    props: [{ name: "number", type: "number", required: true }],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: "FootnoteAnchor",
    kind: "text",
    source: `${COMPONENT_PATH}/FootnoteAnchor.astro`,
    defaultExport: true,
    props: [{ name: "number", type: "number", required: true }],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: "NerdAlert",
    kind: "flow",
    source: `${COMPONENT_PATH}/NerdAlert.astro`,
    defaultExport: true,
    props: [],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: "SpoilerAlert",
    kind: "flow",
    source: `${COMPONENT_PATH}/SpoilerAlert.astro`,
    defaultExport: true,
    props: [],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: "Button",
    kind: "text",
    source: `${COMPONENT_PATH}/Button.astro`,
    defaultExport: true,
    props: [{ name: "to", type: "string", required: true }],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
];

interface InsertItem {
  name: string;
  label: string;
  kind: "flow" | "text";
  props: Record<string, string>;
}

const insertItems: InsertItem[] = [
  { name: "Link", label: "Link", kind: "text", props: { to: "https://" } },
  { name: "Tooltip", label: "Tooltip", kind: "text", props: {} },
  {
    name: "FootnoteLink",
    label: "Footnote Link",
    kind: "text",
    props: { number: "1" },
  },
  {
    name: "FootnoteAnchor",
    label: "Footnote Anchor",
    kind: "text",
    props: { number: "1" },
  },
  { name: "NerdAlert", label: "Nerd Alert", kind: "flow", props: {} },
  { name: "SpoilerAlert", label: "Spoiler Alert", kind: "flow", props: {} },
  { name: "Button", label: "Button", kind: "text", props: { to: "https://" } },
];

function InsertComponentButton() {
  const insertJsx = usePublisher(insertJsx$);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        title="Insert component"
        onClick={() => setOpen((o) => !o)}
        style={{
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: "4px 8px",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        &lt;/&gt; Components ▾
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 50,
            background: "var(--baseBg, white)",
            border: "1px solid var(--baseBorder, #ccc)",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: 160,
          }}
        >
          {insertItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                insertJsx({
                  name: item.name,
                  kind: item.kind,
                  props: item.props,
                });
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 12px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "13px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--accentBgHover, #f0f0f0)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostEditor() {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(
    () => new URL(window.location.href).searchParams.get("draft"),
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [status, setStatus] = useState<{ text: string; html?: string }>({
    text: "",
  });
  const [loaded, setLoaded] = useState(!currentDraftId);
  const [initialMarkdown, setInitialMarkdown] = useState("");

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();
  const draftIdRef = useRef(currentDraftId);
  draftIdRef.current = currentDraftId;

  // Load existing draft
  useEffect(() => {
    if (!currentDraftId) return;

    fetch(`/api/drafts/${currentDraftId}`)
      .then((r) => r.json())
      .then((data) => {
        setInitialMarkdown(data.content || "");
        if (data.frontmatter) {
          setTitle(data.frontmatter.title || "");
          setDescription(data.frontmatter.description || "");
          setTags((data.frontmatter.tags || []).join(", "));
          setCategories((data.frontmatter.categories || []).join(", "));
        }
        setLoaded(true);
      })
      .catch(() => setStatus({ text: "Failed to load draft" }));
  }, []);

  function getFrontmatter(): Frontmatter {
    return {
      author: "John Pangalos",
      title: title || "Untitled",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      description,
      tags: parseCsv(tags),
      categories: parseCsv(categories),
    };
  }

  const saveDraft = useCallback(
    async (silent = false) => {
      const markdown = editorRef.current?.getMarkdown() || "";

      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draftIdRef.current,
          title: title || "Untitled",
          content: markdown,
          frontmatter: getFrontmatter(),
        }),
      });

      if (!res.ok) {
        setStatus({ text: "Failed to save draft" });
        return;
      }

      const data = await res.json();
      setCurrentDraftId(data.id);
      const url = new URL(window.location.href);
      url.searchParams.set("draft", data.id);
      history.replaceState(null, "", url);

      if (!silent) {
        setStatus({ text: "Draft saved!" });
        setTimeout(() => setStatus({ text: "" }), 2000);
      }
    },
    [title, description, tags, categories],
  );

  function handleEditorChange() {
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => saveDraft(true), 30000);
  }

  async function handlePublish() {
    if (!title) {
      setStatus({ text: "Please set a title before publishing" });
      return;
    }
    if (!confirm("Create a PR for this post?")) return;

    await saveDraft(true);
    setStatus({ text: "Publishing..." });

    const res = await fetch(`/api/drafts/${draftIdRef.current}/publish`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      setStatus({
        text: "",
        html: `PR created! <a href="${data.pr_url}" target="_blank" class="underline text-fuchsia-700 dark:text-fuchsia-500">View pull request</a>`,
      });
    } else {
      const err = await res.json();
      setStatus({ text: `Publish failed: ${err.error}` });
    }
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-display text-3xl font-bold text-amber-600 dark:text-amber-500">
          Write
        </h2>
        <a
          href="/drafts"
          className="text-fuchsia-700 underline dark:text-fuchsia-500"
        >
          View drafts
        </a>
      </div>

      {/* Frontmatter fields */}
      <details className="mb-4 rounded border border-stone-300 dark:border-stone-600">
        <summary className="cursor-pointer px-3 py-2 font-bold">
          Post metadata
        </summary>
        <div className="space-y-3 px-3 pb-3">
          <div>
            <label htmlFor="fm-title" className="block text-sm font-bold">
              Title
            </label>
            <input
              type="text"
              id="fm-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              placeholder="my.post.title"
            />
          </div>
          <div>
            <label
              htmlFor="fm-description"
              className="block text-sm font-bold"
            >
              Description
            </label>
            <textarea
              id="fm-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
              placeholder="A short description of the post"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fm-tags" className="block text-sm font-bold">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="fm-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="web, css"
              />
            </div>
            <div>
              <label
                htmlFor="fm-categories"
                className="block text-sm font-bold"
              >
                Categories
              </label>
              <input
                type="text"
                id="fm-categories"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="w-full rounded border border-stone-300 bg-white px-2 py-1 text-sm text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
                placeholder="web"
              />
            </div>
          </div>
        </div>
      </details>

      {/* MDX Editor */}
      {loaded && (
        <div className="mdx-editor-wrapper rounded border border-stone-300 dark:border-stone-600">
          <MDXEditor
            ref={editorRef}
            markdown={initialMarkdown}
            onChange={handleEditorChange}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              markdownShortcutPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  js: "JavaScript",
                  ts: "TypeScript",
                  jsx: "JSX",
                  tsx: "TSX",
                  css: "CSS",
                  html: "HTML",
                  json: "JSON",
                  bash: "Bash",
                  python: "Python",
                  go: "Go",
                  rust: "Rust",
                  sql: "SQL",
                  yaml: "YAML",
                  "": "Plain text",
                },
              }),
              jsxPlugin({ jsxComponentDescriptors }),
              imagePlugin(),
              diffSourcePlugin({ viewMode: "rich-text" }),
              toolbarPlugin({
                toolbarContents: () => (
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <CreateLink />
                    <InsertImage />
                    <Separator />
                    <InsertCodeBlock />
                    <InsertThematicBreak />
                    <Separator />
                    <InsertComponentButton />
                  </DiffSourceToggleWrapper>
                ),
              }),
            ]}
            contentEditableClassName="prose dark:prose-invert min-h-[50vh] px-4 py-3 max-w-none"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3">
        <button
          onClick={() => saveDraft(false)}
          className="rounded bg-fuchsia-700 px-4 py-2 text-sm font-bold text-white dark:bg-fuchsia-600"
        >
          Save draft
        </button>
        <button
          onClick={handlePublish}
          className="rounded bg-amber-600 px-4 py-2 text-sm font-bold text-white dark:bg-amber-500"
        >
          Create PR
        </button>
      </div>
      {(status.text || status.html) && (
        <p
          className="pt-2 text-sm"
          {...(status.html
            ? { dangerouslySetInnerHTML: { __html: status.html } }
            : { children: status.text })}
        />
      )}
    </div>
  );
}
