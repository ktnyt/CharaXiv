import clsx from "clsx";
import { Component, ComponentProps } from "solid-js";

export type SectionProps = ComponentProps<"section">;

export const Section: Component<SectionProps> = (props) => (
  <section
    {...props}
    class={clsx("bg-nord-0 transition dark:bg-nord-1000", props.class)}
  />
);
