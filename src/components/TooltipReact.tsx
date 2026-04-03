import { useState, useEffect, type ReactNode } from "react";
import {
  TooltipTrigger,
  Tooltip as AriaTooltip,
  DialogTrigger,
  Popover,
  Pressable,
  Focusable,
} from "react-aria-components";
import Link from "./Link";

interface Props {
  main: string;
  hover: string;
  to?: string;
}

export function parseInlineMarkdown(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let key = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<b key={key++}>{match[2]}</b>);
    } else if (match[3]) {
      parts.push(<i key={key++}>{match[3]}</i>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

export default function Tooltip({ main, hover, to }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    );
  }, []);

  const parsedMain = parseInlineMarkdown(main);
  const parsedHover = parseInlineMarkdown(hover);

  let triggerContent: ReactNode;
  if (isMobile && to) {
    triggerContent = (
      <span className="font-medium text-orange-600 dark:text-orange-400">
        {parsedMain}
      </span>
    );
  } else if (to) {
    triggerContent = (
      <Link className="no-underline" style={{ textWrap: "nowrap" }} to={to}>
        {parsedMain}
      </Link>
    );
  } else {
    triggerContent = parsedMain;
  }

  // Mobile: tap-to-show Popover (React Aria tooltips don't show on touch)
  if (isMobile) {
    let popupContent: ReactNode;
    if (to) {
      popupContent = (
        <a
          rel="noreferrer"
          className="text-white underline"
          href={to}
          target="_blank"
        >
          {parsedHover}
        </a>
      );
    } else {
      popupContent = parsedHover;
    }

    return (
      <span className="!my-0 inline-flex">
        <DialogTrigger>
          <Pressable>
            <span
              role="button"
              className="border-b-2 border-dotted border-fuchsia-700"
            >
              {triggerContent}
            </span>
          </Pressable>
          <Popover
            placement="top"
            offset={4}
            className="z-50 max-w-[250px] rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white"
          >
            {popupContent}
          </Popover>
        </DialogTrigger>
      </span>
    );
  }

  // Desktop: React Aria TooltipTrigger with native hover/focus
  return (
    <span className="!my-0 inline-flex">
      <TooltipTrigger delay={300} closeDelay={100}>
        <Focusable>
          <span
            role="button"
            tabIndex={0}
            className="border-b-2 border-dotted border-fuchsia-700"
          >
            {triggerContent}
          </span>
        </Focusable>
        <AriaTooltip
          placement="top"
          offset={4}
          className="z-50 w-max max-w-[250px] rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white"
        >
          {parsedHover}
        </AriaTooltip>
      </TooltipTrigger>
    </span>
  );
}
