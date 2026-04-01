import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  TooltipTrigger,
  Tooltip as AriaTooltip,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    );
  }, []);

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;

    const handleTouchOutside = (e: TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("touchstart", handleTouchOutside, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener("touchstart", handleTouchOutside, {
        capture: true,
      });
  }, [isMobile, mobileOpen]);

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

  // Mobile: custom tap-to-show (React Aria tooltips don't show on touch)
  if (isMobile) {
    const popupContent = to ? (
      <a
        rel="noreferrer"
        className="text-white underline"
        href={to}
        target="_blank"
        onClick={() => setMobileOpen(false)}
      >
        {hover}
      </a>
    ) : (
      hover
    );

    return (
      <span ref={rootRef} className="relative !my-0 inline-flex">
        <span
          className="border-b-2 border-dotted border-fuchsia-700"
          onTouchStart={() => setMobileOpen((o) => !o)}
        >
          {triggerContent}
        </span>
        {mobileOpen && (
          <span
            role="tooltip"
            className="absolute bottom-full left-1/2 z-50 mb-1 w-max max-w-[250px] -translate-x-1/2 rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white"
          >
            {popupContent}
          </span>
        )}
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
