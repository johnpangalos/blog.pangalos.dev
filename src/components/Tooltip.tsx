import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from "@headlessui/react";
import Link from "./Link";

interface Props {
  main: ReactNode;
  hover: ReactNode;
  to?: string;
}

export default function Tooltip({ main, hover, to }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    );
  }, []);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleTouchOutside = (e: TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
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
  }, [isMobile, isOpen]);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

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

  const popupContent =
    isMobile && to ? (
      <CloseButton
        as="a"
        rel="noreferrer"
        className="text-white underline"
        href={to}
        target="_blank"
      >
        {hover}
      </CloseButton>
    ) : (
      hover
    );

  return (
    <span ref={rootRef} className="relative !my-0 inline-flex">
      <Popover>
        <PopoverButton
          as="span"
          className="border-b-2 border-dotted border-fuchsia-700"
          onMouseEnter={show}
          onMouseLeave={hide}
          onTouchStart={show}
        >
          {triggerContent}
        </PopoverButton>
        {isOpen && (
          <PopoverPanel
            static
            as="span"
            className="absolute bottom-full left-1/2 z-50 mb-1 w-max max-w-[250px] -translate-x-1/2 rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white"
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {popupContent}
          </PopoverPanel>
        )}
      </Popover>
    </span>
  );
}
