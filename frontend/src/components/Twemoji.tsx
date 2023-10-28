import { Component, createEffect, untrack } from "solid-js";
import twemoji from "twemoji";

export type TwemojiProps = {
  children: string;
};

export const Twemoji: Component<TwemojiProps> = (props) => {
  let ref!: HTMLSpanElement;
  createEffect(() => {
    untrack(() => props.children);
    twemoji.parse(ref);
  });
  return (
    <span
      ref={ref}
      class="inline-block h-4 w-4 align-text-bottom text-[32px] leading-8"
    >
      {props.children}
    </span>
  );
};
