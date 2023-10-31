import { Component, For } from "solid-js";
import { sequence } from "./utils";

export type SequenceProps = {
  min?: number;
  max: number;
};

export const Sequence: Component<SequenceProps> = (props) => {
  const values = () => sequence(props.min ?? 0, props.max + 1);
  return (
    <For each={values()}>
      {(value) => <div class="font-semibold tabular-nums">{value}</div>}
    </For>
  );
};
