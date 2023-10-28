import { Component, Show, createEffect, createSignal } from "solid-js";
import { Wysiwyg } from "./Wysiwyg";
import { Markdown } from "./Markdown";

export type EditorProps = {
  value?: string;
  wysiwyg?: boolean;
  readonly?: boolean;
  atChange?: (markdown: string) => void;
};

export const Editor: Component<EditorProps> = (props) => {
  const wysiwyg = () => (props.readonly ?? false) || (props.wysiwyg ?? false);
  const [markdown, setMarkdown] = createSignal(props.value ?? "");
  const atChange = (markdown: string) => {
    if (props.atChange) props.atChange(markdown);
    setMarkdown(markdown);
  };

  return (
    <Show
      when={wysiwyg()}
      fallback={<Markdown markdown={markdown()} atChange={atChange} />}
    >
      <Wysiwyg markdown={markdown()} atChange={atChange} />
    </Show>
  );
};
