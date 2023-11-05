import { Sequence } from "@charaxiv/components/Sequence";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";
import { Component, For, Index, createSignal } from "solid-js";

export type DoubleSlideSelectorProps = {
  value: number;
  atCommit: (value: number) => void;
  min?: number;
  max?: number;
};

export const DoubleSlideSelector: Component<DoubleSlideSelectorProps> = (
  props,
) => {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;

  const [getValue, setValue] = createSignal(props.value);

  const tenth = (x: number) => Math.sign(x) * Math.floor(Math.abs(x / 10));

  return (
    <div class="flex w-full flex-col justify-center">
      <SlideSelector index={getValue()} atCommit={(value) => setValue(value)}>
        <Sequence min={min()} max={max()} />
      </SlideSelector>
      <SlideSelector
        index={tenth(getValue())}
        atCommit={(value) =>
          setValue(
            (prev) => value * 10 + ((Math.sign(prev) * Math.abs(prev)) % 10),
          )
        }
      >
        <For each={sequence(tenth(min()), tenth(max()))}>
          {(value) => (
            <div class="flex items-center justify-center font-semibold tabular-nums">
              <span>{`${value}0`}</span>
            </div>
          )}
        </For>
      </SlideSelector>
    </div>
  );
};
