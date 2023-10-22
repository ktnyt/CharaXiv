import clsx from "clsx";
import { Component, JSX } from "solid-js";

export type ButtonGroupProps = {
  vertical?: boolean;
  children: JSX.Element;
};

export const ButtonGroup: Component<ButtonGroupProps> = (props) => {
  return (
    <div
      class={clsx(
        "flex overflow-clip rounded",
        props.vertical ?? false ? "flex-col" : "flex-row",
        "[&>*]:rounded-none",
      )}
    >
      {props.children}
    </div>
  );
};
