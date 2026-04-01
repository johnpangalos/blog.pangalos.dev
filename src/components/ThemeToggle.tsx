import { useState } from "react";
import { Button } from "react-aria-components";

interface Props {
  initialTheme: string;
}

export default function ThemeToggle({ initialTheme }: Props) {
  const [theme, setTheme] = useState(initialTheme);

  const toggle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";

    document.cookie = `theme=${newTheme};path=/;max-age=${60 * 60 * 24 * 30}`;

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setTheme(newTheme);
  };

  return <Button onClick={toggle}>{theme}</Button>;
}
