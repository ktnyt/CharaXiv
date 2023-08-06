import { Accessor, createRoot, onCleanup, onMount } from "solid-js";
import { createLocalStorage } from "../hooks/createLocalStorage";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const createColorScheme = (): [Accessor<boolean>, () => void] => {
  const [isDark, setIsDark] = createLocalStorage(
    "theme",
    window.matchMedia(COLOR_SCHEME_QUERY).matches,
  );

  const toggleIsDark = () => setIsDark((prev) => !prev);

  const onChange = () =>
    setIsDark(window.matchMedia(COLOR_SCHEME_QUERY).matches);

  onMount(() => {
    window.matchMedia(COLOR_SCHEME_QUERY).addEventListener("change", onChange);
  });

  onCleanup(() => {
    window
      .matchMedia(COLOR_SCHEME_QUERY)
      .removeEventListener("change", onChange);
  });

  return [isDark, toggleIsDark];
};

export const [isDark, toggleIsDark] = createRoot(createColorScheme);
