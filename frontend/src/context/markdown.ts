import { createLocalStorage } from "@charaxiv/hooks/createLocalStorage";
import { createRoot } from "solid-js";

export const [MarkdownMode, MarkdownModeToggle] = createRoot(() => {
  const [markdownModeGet, markdownModeSet] = createLocalStorage(
    "markdown",
    false,
  );
  return [markdownModeGet, () => markdownModeSet((prev) => !prev)];
});
