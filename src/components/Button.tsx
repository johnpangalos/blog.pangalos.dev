import type { ReactNode } from "react";

interface Props {
  to: string;
  children: ReactNode;
}

export default function Button({ to, children }: Props) {
  return (
    <a
      href={to}
      role="button"
      className="flex justify-end rounded py-1 px-3 text-lg font-bold text-fuchsia-700 underline hover:bg-gray-100 dark:border-fuchsia-400 dark:text-fuchsia-400 dark:hover:bg-stone-800"
    >
      {children}
    </a>
  );
}
