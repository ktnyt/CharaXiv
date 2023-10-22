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
  createEffect(() => {
    if (props.atChange) props.atChange(markdown());
  });

  return (
    <Show
      when={wysiwyg()}
      fallback={
        <Markdown
          markdown={markdown()}
          atChange={(markdown) => setMarkdown(markdown)}
        />
      }
    >
      <Wysiwyg
        markdown={markdown()}
        atChange={(markdown) => setMarkdown(markdown)}
      />
    </Show>
  );
};
