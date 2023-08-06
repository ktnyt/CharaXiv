import {
  Component,
  createEffect,
  createSignal,
  For,
  JSXElement,
} from "solid-js";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { Content, PhrasingContent } from "mdast";
import remarkHtml from "remark-html";

export type MarkdownProps = {
  text: string;
};

export const Markdown: Component<MarkdownProps> = (props) => {
  const [innerHTML, innerHTMLSet] = createSignal<string>();
  createEffect(async () => {
    innerHTMLSet(
      String(
        await remark()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkHtml, true)
          .process(props.text),
      ),
    );
  });
  return <div class="markdown-body" innerHTML={innerHTML()} />;
};
