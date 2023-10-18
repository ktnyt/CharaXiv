import { createRoot } from "solid-js";

const createViewport = () => {
  const html = document.getElementById("html")!;
  const scroll = (enable: boolean) => {
    html.style.overflow = enable ? "" : "clip";
  };
  return { scroll };
};

export const Viewport = createRoot(createViewport);
