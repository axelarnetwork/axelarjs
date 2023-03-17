import { useThemeSwitcher } from "../components";

export function useTheme() {
  const [theme] = useThemeSwitcher();

  return theme;
}
