import { Component, createEffect, onMount } from "solid-js";
import Toast from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "./styles.css";

export type EditorProps = {
  value?: string;
  advanced?: boolean;
  readonly?: boolean;
  atChange?: (markdown: string) => void;
};

export const Editor: Component<EditorProps> = (props) => {
  let editor!: Toast;
  let ref!: HTMLDivElement;

  onMount(() => {
    editor = new Toast({
      el: ref,
      language: "ja-JP",
      initialEditType: "wysiwyg",
      toolbarItems: [
        ["heading", "quote", "ul", "ol"],
        ["bold", "italic", "strike"],
        ["hr"],
      ],
      autofocus: false,
      hideModeSwitch: true,
      viewer: props.readonly ?? false,
      initialValue: props.value,
      events: {
        change: () => {
          if (props.atChange) props.atChange(editor.getMarkdown());
        },
      },
    });
  });

  createEffect(() =>
    editor.changeMode(props.advanced ?? false ? "markdown" : "wysiwyg", true),
  );

  return <div class="flex w-full flex-col" ref={ref}></div>;
};
