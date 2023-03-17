import { FC, useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { createContainer } from "unstated-next";

export const VALID_THEMES = ["light", "dark"] as const;

export type ThemeKind = (typeof VALID_THEMES)[number];
export const THEME_KEY = "@axelarui/theme";

export function isValidTheme(theme: string): theme is ThemeKind {
  // rome-ignore lint/suspicious/noExplicitAny: avoid union type mismatch
  return VALID_THEMES.includes(theme as any);
}

function persistTheme(theme: ThemeKind) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

function useThemeState(initialState: ThemeKind | null = null) {
  const [theme, setTheme] = useState<ThemeKind | null>(initialState);

  useEffect(() => {
    if (theme) {
      persistTheme(theme);
      return;
    }

    const persistedTheme = localStorage.getItem(THEME_KEY);

    const defaultTheme =
      persistedTheme && isValidTheme(persistedTheme) ? persistedTheme : "light";

    setTheme(defaultTheme);
  }, [theme]);

  const handleToggleTheme = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      const target = evt.target as HTMLElement;

      const [primaryTheme, secondaryTheme] =
        target.dataset.toggleTheme?.split(",") ?? [];

      const currentTheme = document.documentElement.getAttribute("data-theme");

      if (!(isValidTheme(primaryTheme) && isValidTheme(secondaryTheme))) {
        console.warn(
          `Invalid theme data: ${primaryTheme}, ${secondaryTheme}. Expected "light" or "dark".`
        );
        return;
      }

      const nextTheme =
        currentTheme === primaryTheme ? secondaryTheme : primaryTheme;

      setTheme(nextTheme);
    },
    []
  );

  return [theme, { toggleTheme: handleToggleTheme }] as const;
}

export const { Provider: ThemeProvider, useContainer: useThemeSwitcher } =
  createContainer(useThemeState);

export type ThemeSwitcherProps = {};

export const ThemeSwitcher: FC<ThemeSwitcherProps> = () => {
  const [theme, actions] = useThemeSwitcher();

  return (
    <button
      data-toggle-theme={VALID_THEMES.join(",")}
      onClick={actions.toggleTheme}
      className={clsx("swap swap-rotate", { "swap-active": theme === "dark" })}
    >
      <Sun className="swap-on pointer-events-none h-6 w-6" />
      <Moon className="swap-off pointer-events-none h-6 w-6" />
    </button>
  );
};
