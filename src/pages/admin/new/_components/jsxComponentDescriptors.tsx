import type { JsxComponentDescriptor, JsxEditorProps } from "@mdxeditor/editor";
import { useMdastNodeUpdater } from "@mdxeditor/editor";
import { useState } from "react";
import {
  Button,
  TextField,
  Input,
  Label,
  TextArea,
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
      <DialogTrigger
        onOpenChange={(isOpen) => {
          if (isOpen) {
            resetFields();
          }
        }}
      >
        <Pressable>
          <span
            role="button"
            className="cursor-pointer border-b-2 border-dotted border-fuchsia-700"
          >
            {main || <span className="text-zinc-400">empty tooltip</span>}
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
                  className="flex gap-1"
                >
                  <Label className="mt-px min-w-[40px] font-semibold text-fuchsia-900">
                    hover
                  </Label>
                  <TextArea
                    rows={3}
                    className="w-[160px] resize-y rounded-sm border border-zinc-300 px-1 py-px text-[13px]"
                  />
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

function YouTubeEditor({ mdastNode }: JsxEditorProps) {
  const updateMdastNode = useMdastNodeUpdater();

  const videoId = getAttrValue(mdastNode.attributes, "videoId");
  const title = getAttrValue(mdastNode.attributes, "title");

  const [editVideoId, setEditVideoId] = useState(videoId);
  const [editTitle, setEditTitle] = useState(title);

  function save(close: () => void) {
    const attrs: typeof mdastNode.attributes = [
      { type: "mdxJsxAttribute", name: "videoId", value: editVideoId },
    ];
    if (editTitle) {
      attrs.push({ type: "mdxJsxAttribute", name: "title", value: editTitle });
    }
    updateMdastNode({ attributes: attrs });
    close();
  }

  function resetFields() {
    setEditVideoId(videoId);
    setEditTitle(title);
  }

  function renderTrigger() {
    if (!videoId) {
      return (
        <span
          role="button"
          className="cursor-pointer border-b-2 border-dotted border-red-700 text-zinc-400"
        >
          empty video
        </span>
      );
    }
    return (
      <span
        role="button"
        className="inline-block cursor-pointer overflow-hidden rounded border-2 border-red-700"
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={title || "YouTube thumbnail"}
          className="block w-[240px]"
        />
      </span>
    );
  }

  return (
    <div className="flex w-full justify-center py-2" contentEditable={false}>
      <DialogTrigger
        onOpenChange={(isOpen) => {
          if (isOpen) {
            resetFields();
          }
        }}
      >
        <Pressable>{renderTrigger()}</Pressable>
        <Popover
          placement="bottom"
          offset={4}
          className="z-50 flex flex-col gap-1 rounded border border-red-600 bg-white p-2 text-[13px] shadow-lg"
        >
          <Dialog className="flex flex-col gap-1 outline-none">
            {({ close }) => (
              <>
                <TextField
                  autoFocus
                  value={editVideoId}
                  onChange={setEditVideoId}
                  className="flex items-center gap-1"
                >
                  <Label className="min-w-[40px] font-semibold text-red-900">
                    id
                  </Label>
                  <Input
                    placeholder="e.g. dQw4w9WgXcQ"
                    className="w-[200px] rounded-sm border border-zinc-300 px-1 py-px text-[13px]"
                  />
                </TextField>
                <TextField
                  value={editTitle}
                  onChange={setEditTitle}
                  className="flex items-center gap-1"
                >
                  <Label className="min-w-[40px] font-semibold text-red-900">
                    title
                  </Label>
                  <Input
                    placeholder="optional title"
                    className="w-[200px] rounded-sm border border-zinc-300 px-1 py-px text-[13px]"
                  />
                </TextField>
                <span className="mt-1 flex gap-1">
                  <Button
                    onPress={() => save(close)}
                    className="cursor-pointer rounded-sm bg-red-600 px-2 py-0.5 text-xs text-white"
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
  {
    name: "YouTube",
    kind: "flow",
    source: "../../components/YouTube.tsx",
    defaultExport: true,
    props: [
      { name: "videoId", type: "string", required: true },
      { name: "title", type: "string" },
    ],
    hasChildren: false,
    Editor: YouTubeEditor,
  },
];
