import clsx from "clsx";
import { Component, ComponentProps, splitProps } from "solid-js";

export type LabelProps = ComponentProps<"label">;

export const Label: Component<LabelProps> = (props) => {
  const [cls, others] = splitProps(props, ["class"]);
  return (
    <label
      class={clsx(
        cls,
        "mb-1 inline-block text-sm text-nord-800 dark:text-nord-200",
      )}
      {...others}
    />
  );
};
