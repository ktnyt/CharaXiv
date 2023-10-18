import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Component, For, createSignal } from "solid-js";

export type DoubleSlideSelectorProps = {
  value: number;
  setValue: (value: number) => void;
};

export const DoubleSlideSelector: Component<DoubleSlideSelectorProps> = (
  props,
) => {
  const [getValue, setValue] = createSignal(props.value);
  return (
    <div class="flex w-full flex-col justify-center">
      <SlideSelector index={getValue()} atCommit={(value) => setValue(value)}>
        <For each={[...new Array(100)].map((_, index) => index)}>
          {(index) => <div>{index}</div>}
        </For>
      </SlideSelector>
      <SlideSelector
        index={Math.floor(getValue() / 10)}
        atCommit={(value) => setValue((prev) => value * 10 + (prev % 10))}
      >
        <For each={[...new Array(10)].map((_, index) => `${index}X`)}>
          {(index) => <div>{index}</div>}
        </For>
      </SlideSelector>
    </div>
  );
};
