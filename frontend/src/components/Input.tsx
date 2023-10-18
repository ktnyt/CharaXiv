import clsx from "clsx";
import { Component } from "solid-js";
import { InputBase, InputBaseProps } from "./InputBase";
import { twMerge } from "tailwind-merge";

export type InputColor =
  | "default"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "purple";

export type InputProps = InputBaseProps & {
  color?: InputColor;
  borderless?: boolean;
};

export const Input: Component<InputProps> = (props) => {
  const color = () => props.color ?? "default";

  return (
    <InputBase
      {...props}
      class={twMerge(
        "inline-flex w-full cursor-text select-none rounded bg-nord-500 bg-opacity-0 p-2 text-base leading-4 transition placeholder:text-nord-500 hover:bg-opacity-10 focus:outline-none active:outline-none",
        "read-only:cursor-not-allowed read-only:bg-opacity-10 read-only:text-nord-500",
        props.borderless ? "border-none" : "border",
        "text-nord-1000 caret-nord-1000 dark:text-nord-0 dark:caret-nord-0",
        // prettier-ignore
        clsx(
          color() == "default", false && "border-nord-400   dark:border-nord-600",
          color() == "blue",    false && "border-blue-500   dark:border-blue-500",
          color() == "green",   false && "border-green-500  dark:border-green-500",
          color() == "yellow",  false && "border-yellow-500 dark:border-yellow-500",
          color() == "red",     false && "border-red-500    dark:border-red-500",
          color() == "purple",  false && "border-purple-500 dark:border-purple-500",
        ),
        props.class,
      )}
    />
  );
};
