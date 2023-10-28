import { Component, ComponentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export type H1Props = ComponentProps<"h1">;

export const H1: Component<H1Props> = (props) => {
  const [local, attrs] = splitProps(props, ["class"]);
  return (
    <h1 class={twMerge("text-3xl font-semibold", local.class)} {...attrs} />
  );
};

export type H2Props = ComponentProps<"h2">;

export const H2: Component<H2Props> = (props) => {
  const [local, attrs] = splitProps(props, ["class"]);
  return (
    <h2 class={twMerge("text-2xl font-semibold", local.class)} {...attrs} />
  );
};

export type H3Props = ComponentProps<"h3">;

export const H3: Component<H3Props> = (props) => {
  const [local, attrs] = splitProps(props, ["class"]);
  return (
    <h2 class={twMerge("text-xl font-semibold", local.class)} {...attrs} />
  );
};
