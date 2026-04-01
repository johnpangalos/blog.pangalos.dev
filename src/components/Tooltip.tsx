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
  main: ReactNode;
  hover: ReactNode;
  to?: string;
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

  const triggerContent =
    isMobile && to ? (
      <span className="font-medium text-orange-600 dark:text-orange-400">
        {main}
      </span>
    ) : to ? (
      <Link className="no-underline" style={{ textWrap: "nowrap" }} to={to}>
        {main}
      </Link>
    ) : (
      main
    );

  // Mobile: tap-to-show Popover (React Aria tooltips don't show on touch)
  if (isMobile) {
    const popupContent = to ? (
      <a
        rel="noreferrer"
        className="text-white underline"
        href={to}
        target="_blank"
      >
        {hover}
      </a>
    ) : (
      hover
    );

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
          {hover}
        </AriaTooltip>
      </TooltipTrigger>
    </span>
  );
}
