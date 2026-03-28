import { useRef, useEffect, useState, type ReactNode } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

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
    <span className="relative !my-0 inline-flex">
      <Popover>
        {({ open, close }) => {
          const openPopover = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (!open) buttonRef.current?.click();
          };

          const closePopover = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => close(), 100);
          };

          return (
            <>
              <PopoverButton
                as="span"
                ref={buttonRef}
                className="border-b-2 border-dotted border-fuchsia-700 focus:outline-none"
                onMouseEnter={openPopover}
                onMouseLeave={closePopover}
                onTouchStart={(e: React.TouchEvent) => {
                  if (open) {
                    e.preventDefault();
                    close();
                  }
                }}
              >
                {triggerContent}
              </PopoverButton>
              {open && (
                <PopoverPanel
                  static
                  as="span"
                  className="absolute bottom-full left-1/2 z-50 mb-1 w-max max-w-[250px] -translate-x-1/2 rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white"
                  onMouseEnter={() => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  }}
                  onMouseLeave={closePopover}
                >
                  {popupContent}
                </PopoverPanel>
              )}
            </>
          );
        }}
      </Popover>
    </span>
  );
}
