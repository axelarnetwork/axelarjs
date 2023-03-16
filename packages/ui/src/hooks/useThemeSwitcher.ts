import { useEffect, useState } from "react";

const VALID_THEMES = ["light", "dark"] as const;

export type ThemeKind = (typeof VALID_THEMES)[number];

export function isValidTheme(theme: string): theme is ThemeKind {
  // rome-ignore lint/suspicious/noExplicitAny: avoid union type mismatch
  return VALID_THEMES.includes(theme as any);
}

export function useThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeKind | null>(null);

  useEffect(() => {
    if (!theme) {
      const storedTheme = localStorage.getItem("theme");

      return setTheme(
        storedTheme && isValidTheme(storedTheme) ? storedTheme : "light"
      );
    }

    const { classList } = document.documentElement;

    classList.remove("transition-colors", "light", "dark");
    classList.add("transition-colors", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme] as const;
}
