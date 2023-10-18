import { Component, createSignal } from "solid-js";
import { InputProps } from "../Input";
import { InputBase } from "../InputBase";

export type TagInputProps = {
  ref: HTMLInputElement;
  atCommit: (value: string) => void;
  atDelete: () => void;
};

export const TagInput: Component<TagInputProps> = (props) => {
  const [inputValue, inputValueSet] = createSignal("");

  const inputKeyDown: InputProps["onKeyDown"] = (event) => {
    const value = inputValue();
    if (["Enter", "Tab"].includes(event.key)) {
      event.preventDefault();
      props.atCommit(value);
      inputValueSet("");
      event.currentTarget.value = "";
    }

    if (value === "" && event.key === "Backspace") {
      props.atDelete();
    }
  };

  return (
    <InputBase
      ref={props.ref}
      class="w-full min-w-[80px] border-none bg-nord-0 bg-opacity-0 caret-nord-1000 transition focus:outline-none active:outline-none dark:caret-nord-0"
      size={1}
      spellcheck={false}
      placeholder="タグを追加"
      onInput={(event) => inputValueSet(event.currentTarget.value)}
      onKeyDown={inputKeyDown}
    />
  );
};
