import { Component, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export type LayoutProps = {
  children: JSX.Element;
};

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <div
      class={twMerge(
        "grid w-full grid-cols-1 items-start",
        "xl:grid-cols-2 xl:gap-4",
        "2xl:grid-cols-[1fr_2fr]",
      )}
    >
      {props.children}
    </div>
  );
};
