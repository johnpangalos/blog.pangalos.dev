import type { JsxComponentDescriptor, JsxEditorProps } from "@mdxeditor/editor";
import { GenericJsxEditor } from "@mdxeditor/editor";

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
    Editor: (props: JsxEditorProps) => (
      <GenericJsxEditor {...props} />
    ),
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
