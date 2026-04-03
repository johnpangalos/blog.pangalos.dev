import type { JsxComponentDescriptor, JsxEditorProps } from "@mdxeditor/editor";
import { useMdastNodeUpdater } from "@mdxeditor/editor";
import { useState, useRef, useEffect } from "react";

function NerdAlertEditor() {
  const stripeStyle: React.CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(120deg, #facc15 0, #facc15 30px, #374151 30px, #374151 60px)",
  };

  return (
    <div
      className="flex w-full justify-center py-6"
      style={stripeStyle}
      contentEditable={false}
    >
      <div className="flex items-center justify-center border-4 border-black bg-white px-4 py-2">
        <span className="text-xl font-medium text-black">NERD ALERT</span>
      </div>
    </div>
  );
}

function SpoilerAlertEditor() {
  const stripeStyle: React.CSSProperties = {
    backgroundImage:
      "repeating-linear-gradient(120deg, #f97316 0, #f97316 30px, #374151 30px, #374151 60px)",
  };

  return (
    <div
      className="flex w-full justify-center py-6"
      style={stripeStyle}
      contentEditable={false}
    >
      <div className="flex items-center justify-center border-4 border-black bg-white px-4 py-2">
        <span className="text-xl font-medium text-black">SPOILER ALERT</span>
      </div>
    </div>
  );
}

function getAttrValue(
  attributes: JsxEditorProps["mdastNode"]["attributes"],
  name: string,
): string {
  for (const attr of attributes) {
    if (attr.type === "mdxJsxAttribute" && attr.name === name) {
      if (typeof attr.value === "string") {
        return attr.value;
      }
    }
  }
  return "";
}

function TooltipEditor({ mdastNode }: JsxEditorProps) {
  const updateMdastNode = useMdastNodeUpdater();

  const main = getAttrValue(mdastNode.attributes, "main");
  const hover = getAttrValue(mdastNode.attributes, "hover");
  const to = getAttrValue(mdastNode.attributes, "to");

  const [editing, setEditing] = useState(false);
  const [editMain, setEditMain] = useState(main);
  const [editHover, setEditHover] = useState(hover);
  const [editTo, setEditTo] = useState(to);
  const mainInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && mainInputRef.current) {
      mainInputRef.current.focus();
    }
  }, [editing]);

  function save() {
    const attrs: typeof mdastNode.attributes = [
      { type: "mdxJsxAttribute", name: "main", value: editMain },
      { type: "mdxJsxAttribute", name: "hover", value: editHover },
    ];
    if (editTo) {
      attrs.push({ type: "mdxJsxAttribute", name: "to", value: editTo });
    }
    updateMdastNode({ attributes: attrs });
    setEditing(false);
  }

  if (editing) {
    return (
      <span
        style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}
        contentEditable={false}
      >
        <span
          style={{
            display: "inline-flex",
            flexDirection: "column",
            gap: "2px",
            border: "1px solid #c026d3",
            borderRadius: "4px",
            padding: "4px 6px",
            background: "#fdf4ff",
            fontSize: "13px",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontWeight: 600, color: "#86198f", minWidth: 40 }}>
              main
            </span>
            <input
              ref={mainInputRef}
              value={editMain}
              onChange={(e) => setEditMain(e.target.value)}
              style={{
                border: "1px solid #d4d4d8",
                borderRadius: "2px",
                padding: "1px 4px",
                fontSize: "13px",
                width: "140px",
              }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontWeight: 600, color: "#86198f", minWidth: 40 }}>
              hover
            </span>
            <input
              value={editHover}
              onChange={(e) => setEditHover(e.target.value)}
              style={{
                border: "1px solid #d4d4d8",
                borderRadius: "2px",
                padding: "1px 4px",
                fontSize: "13px",
                width: "140px",
              }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontWeight: 600, color: "#86198f", minWidth: 40 }}>
              link
            </span>
            <input
              value={editTo}
              onChange={(e) => setEditTo(e.target.value)}
              placeholder="optional URL"
              style={{
                border: "1px solid #d4d4d8",
                borderRadius: "2px",
                padding: "1px 4px",
                fontSize: "13px",
                width: "140px",
              }}
            />
          </label>
          <span style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
            <button
              onClick={save}
              style={{
                background: "#c026d3",
                color: "white",
                border: "none",
                borderRadius: "2px",
                padding: "1px 8px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                background: "#e4e4e7",
                border: "none",
                borderRadius: "2px",
                padding: "1px 8px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </span>
        </span>
      </span>
    );
  }

  return (
    <span
      style={{
        borderBottom: "2px dotted #a21caf",
        cursor: "pointer",
        position: "relative",
      }}
      contentEditable={false}
      onClick={() => {
        setEditMain(main);
        setEditHover(hover);
        setEditTo(to);
        setEditing(true);
      }}
      title={`hover: ${hover}${to ? `\nlink: ${to}` : ""}`}
    >
      {main || <span style={{ color: "#a1a1aa" }}>empty tooltip</span>}
    </span>
  );
}

export const blogJsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "Tooltip",
    kind: "text",
    source: "../../components/Tooltip.astro",
    defaultExport: true,
    props: [
      { name: "main", type: "string", required: true },
      { name: "hover", type: "string", required: true },
      { name: "to", type: "string" },
    ],
    hasChildren: false,
    Editor: TooltipEditor,
  },
  {
    name: "NerdAlert",
    kind: "flow",
    source: "../../components/NerdAlert.tsx",
    defaultExport: true,
    props: [],
    hasChildren: false,
    Editor: NerdAlertEditor,
  },
  {
    name: "SpoilerAlert",
    kind: "flow",
    source: "../../components/SpoilerAlert.tsx",
    defaultExport: true,
    props: [],
    hasChildren: false,
    Editor: SpoilerAlertEditor,
  },
];
