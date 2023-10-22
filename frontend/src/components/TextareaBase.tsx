import { Component, ComponentProps, splitProps } from "solid-js";
import { delegateJSXEvent } from "./utils";

export type TextareaBaseProps = ComponentProps<"textarea"> & {
  dynamic?: boolean;
};

const IGNORE_INPUT_TYPES = ["insertCompositionText", "deleteCompositionText"];

export const TextareaBase: Component<TextareaBaseProps> = (props) => {
  const [local, rest] = splitProps(props, ["onInput"]);
  const onTextareaHandler = delegateJSXEvent(() => local.onInput);
  return (
    <textarea
      {...rest}
      onInput={(event) => {
        if (!IGNORE_INPUT_TYPES.includes(event.inputType))
          onTextareaHandler(event);
      }}
    />
  );
};
