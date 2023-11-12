import { Component, ComponentProps, For } from "solid-js";
import { sequence } from "./utils";
import { twMerge } from "tailwind-merge";

export type SequenceProps = {
  class?: ComponentProps<"div">["class"];
  min?: number;
  max: number;
  step?: number;
};

export const Sequence: Component<SequenceProps> = (props) => {
  const values = () => sequence(props.min ?? 0, props.max + 1, props.step ?? 1);
  return (
    <For each={values()}>
      {(value) => (
        <div
          class={twMerge(
            "flex items-center justify-center font-semibold tabular-nums w-full h-full",
            props.class,
          )}
        >
          <span>{value}</span>
        </div>
      )}
    </For>
  );
};
