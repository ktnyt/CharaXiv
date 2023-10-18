import { Component } from "solid-js";
import { TagInput } from "./TagInput";
import { TagList } from "./TagList";

export type TagEditorProps = {
  tags: string[];
  atUpdate: (tags: string[]) => void;
};

export const TagEditor: Component<TagEditorProps> = (props) => {
  let ref!: HTMLInputElement;

  const tagAddHandle = (value: string) => {
    if (!(value === "" || props.tags.includes(value))) {
      props.atUpdate([...props.tags, value]);
    }
  };

  return (
    <div
      class="flex min-h-[34px] w-full cursor-text flex-row flex-wrap items-center gap-2 rounded border border-solid border-nord-600 bg-nord-500 bg-opacity-0 px-2 py-1 text-nord-1000 transition hover:bg-opacity-10 dark:border-nord-400 dark:text-nord-0"
      onClick={() => ref.focus()}
    >
      <TagList tags={props.tags} atUpdate={props.atUpdate} />
      <div class="flex-grow">
        <TagInput ref={ref} atCommit={tagAddHandle} atDelete={() => {}} />
      </div>
    </div>
  );
};
