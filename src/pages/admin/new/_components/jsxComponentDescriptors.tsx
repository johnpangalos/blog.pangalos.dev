import type { JsxComponentDescriptor, JsxEditorProps } from "@mdxeditor/editor";
import { useMdastNodeUpdater } from "@mdxeditor/editor";
import { useState } from "react";
import {
  Button,
  TextField,
  Input,
  Label,
  DialogTrigger,
  Popover,
  Pressable,
  Dialog,
} from "react-aria-components";

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

  const [editMain, setEditMain] = useState(main);
  const [editHover, setEditHover] = useState(hover);
  const [editTo, setEditTo] = useState(to);

  function save(close: () => void) {
    const attrs: typeof mdastNode.attributes = [
      { type: "mdxJsxAttribute", name: "main", value: editMain },
      { type: "mdxJsxAttribute", name: "hover", value: editHover },
    ];
    if (editTo) {
      attrs.push({ type: "mdxJsxAttribute", name: "to", value: editTo });
    }
    updateMdastNode({ attributes: attrs });
    close();
  }

  function resetFields() {
    setEditMain(main);
    setEditHover(hover);
    setEditTo(to);
  }

  return (
    <span className="inline-flex" contentEditable={false}>
      <DialogTrigger onOpenChange={(isOpen) => {
        if (isOpen) {
          resetFields();
        }
      }}>
        <Pressable>
          <span
            role="button"
            className="cursor-pointer border-b-2 border-dotted border-fuchsia-700"
          >
            {main || (
              <span className="text-zinc-400">empty tooltip</span>
            )}
          </span>
        </Pressable>
        <Popover
          placement="bottom"
          offset={4}
          className="z-50 flex flex-col gap-1 rounded border border-fuchsia-600 bg-white p-2 text-[13px] shadow-lg"
        >
          <Dialog className="flex flex-col gap-1 outline-none">
            {({ close }) => (
              <>
                <TextField
                  autoFocus
                  value={editMain}
                  onChange={setEditMain}
                  className="flex items-center gap-1"
                >
                  <Label className="min-w-[40px] font-semibold text-fuchsia-900">
                    main
                  </Label>
                  <Input className="w-[160px] rounded-sm border border-zinc-300 px-1 py-px text-[13px]" />
                </TextField>
                <TextField
                  value={editHover}
                  onChange={setEditHover}
                  className="flex items-center gap-1"
                >
                  <Label className="min-w-[40px] font-semibold text-fuchsia-900">
                    hover
                  </Label>
                  <Input className="w-[160px] rounded-sm border border-zinc-300 px-1 py-px text-[13px]" />
                </TextField>
                <TextField
                  value={editTo}
                  onChange={setEditTo}
                  className="flex items-center gap-1"
                >
                  <Label className="min-w-[40px] font-semibold text-fuchsia-900">
                    link
                  </Label>
                  <Input
                    placeholder="optional URL"
                    className="w-[160px] rounded-sm border border-zinc-300 px-1 py-px text-[13px]"
                  />
                </TextField>
                <span className="mt-1 flex gap-1">
                  <Button
                    onPress={() => save(close)}
                    className="cursor-pointer rounded-sm bg-fuchsia-600 px-2 py-0.5 text-xs text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onPress={close}
                    className="cursor-pointer rounded-sm bg-zinc-200 px-2 py-0.5 text-xs"
                  >
                    Cancel
                  </Button>
                </span>
              </>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
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
