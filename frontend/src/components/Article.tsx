import clsx from "clsx";
import { Component, ComponentProps } from "solid-js";

export type ArticleProps = ComponentProps<"article">;

export const Article: Component<ArticleProps> = (props) => (
  <article
    class={clsx(
      props.class,
      "flex min-h-screen w-screen flex-col items-center bg-nord-50 text-nord-1000 transition dark:bg-nord-950 dark:text-nord-0",
    )}
  >
    {props.children}
  </article>
);
