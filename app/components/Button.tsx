import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  handleClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export function Button({ children, handleClick, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className="rounded border-2 border-stone-900 px-3 py-1.5 lowercase hover:bg-gray-100 dark:border-white dark:hover:bg-gray-800"
    >
      {children}
    </button>
  );
}
