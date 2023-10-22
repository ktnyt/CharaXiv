import { Component, onCleanup, onMount } from "solid-js";
import { Textarea } from "../Textarea";
import TinyMDE from "easymde";
import "./markdown.css";

export type MarkdownProps = {
  markdown: string;
  atChange: (markdown: string) => void;
};

export const Markdown: Component<MarkdownProps> = (props) => {
  let ref!: HTMLTextAreaElement;
  let easymde: TinyMDE;

  onMount(() => {
    easymde = new TinyMDE({
      element: ref,
      toolbar: false,
      status: false,
      spellChecker: false,
    });
    easymde.value(props.markdown);
    easymde.codemirror.on("change", () => {
      props.atChange(easymde.value());
    });
  });

  onCleanup(() => {
    easymde.cleanup();
    easymde.toTextArea();
  });

  return <Textarea ref={ref} />;
};
