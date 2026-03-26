import { useState, useRef, useEffect, type ReactNode } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Link from "./Link";

interface Props {
  main: ReactNode;
  hover: ReactNode;
  to?: string;
}

export default function Tooltip({ main, hover, to }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
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
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
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

  // On mobile with a link, show plain text + link in tooltip
  if (isMobile && to) {
    return (
      <span ref={triggerRef} className="relative !my-0 inline-flex">
        <Popover>
          <PopoverButton
            as="span"
            className="border-b-2 border-dotted border-fuchsia-700 font-medium text-orange-600 dark:text-orange-400"
            onTouchStart={show}
          >
            {main}
          </PopoverButton>
          {isOpen && (
            <PopoverPanel
              static
              anchor="top"
              className="z-50 mx-2 my-0 w-max max-w-[250px] rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white [--anchor-gap:4px]"
            >
              <a
                rel="noreferrer"
                className="text-white underline"
                href={to}
                target="_blank"
              >
                {hover}
              </a>
            </PopoverPanel>
          )}
        </Popover>
      </span>
    );
  }

  const triggerContent = to ? (
    <Link className="no-underline" style={{ textWrap: "nowrap" }} to={to}>
      {main}
    </Link>
  ) : (
    main
  );

  return (
    <span ref={triggerRef} className="relative !my-0 inline-flex">
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
            anchor="top"
            className="z-50 mx-2 my-0 w-max max-w-[250px] rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white [--anchor-gap:4px]"
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {hover}
          </PopoverPanel>
        )}
      </Popover>
    </span>
  );
}
