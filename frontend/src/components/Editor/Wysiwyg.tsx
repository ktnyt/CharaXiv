import { Component, createSignal, onCleanup, onMount, untrack } from "solid-js";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "./wysiwyg.css";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

export type WysiwygProps = {
  markdown: string;
  atChange: (markdown: string) => void;
};

const toHTML = (markdown: string) =>
  unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(markdown)
    .value.toString();

const toMarkdown = (html: string) =>
  unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkStringify, {
      bullet: "-",
    })
    .processSync(html)
    .value.toString();

export const Wysiwyg: Component<WysiwygProps> = (props) => {
  let editor!: HTMLDivElement;
  let toolbar!: HTMLDivElement;
  let quill: Quill;

  onMount(() => {
    quill = new Quill(editor, {
      modules: {
        toolbar: toolbar,
      },
      theme: "snow",
    });

    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      props.atChange(toMarkdown(html));
    });
  });

  onCleanup(() => {
    while (editor.firstChild) {
      editor.removeChild(editor.firstChild);
    }
  });

  return (
    <div class="flex flex-col">
      <div ref={toolbar}>
        <div>
          <button class="ql-header" value="1" />
          <button class="ql-blockquote" />
          <button class="ql-list" value="bullet" />
          <button class="ql-list" value="ordered" />
        </div>
        <div>
          <button class="ql-bold" />
          <button class="ql-italic" />
          <button class="ql-link" />
        </div>
      </div>
      <div ref={editor} innerHTML={untrack(() => toHTML(props.markdown))} />
    </div>
  );
};
