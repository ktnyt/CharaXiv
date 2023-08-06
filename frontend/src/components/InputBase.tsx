import { Component, ComponentProps, splitProps } from "solid-js";
import { delegateJSXEvent } from "./utils";

export type InputBaseProps = ComponentProps<"input"> & {
  dynamic?: boolean;
};

const IGNORE_INPUT_TYPES = ["insertCompositionText", "deleteCompositionText"];

export const InputBase: Component<InputBaseProps> = (props) => {
  const [local, rest] = splitProps(props, ["onInput"]);
  const onInputHandler = delegateJSXEvent(() => local.onInput);
  return (
    <input
      {...rest}
      onInput={(event) => {
        if (!IGNORE_INPUT_TYPES.includes(event.inputType))
          onInputHandler(event);
      }}
    />
  );
};
