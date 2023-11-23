import clsx from "clsx";
import { Component, For, createSignal } from "solid-js";
import { sequence } from "./utils";
import { Stack } from "./Stack";

export type PickerProps = {};

export const Picker: Component<PickerProps> = (props) => {
  const [active, setActive] = createSignal(false);

  const tensIndex = 0;
  const onesIndex = 0;

  return (
    <div class="h-18 w-16 overflow-clip tabular-nums">
      <div class="flex flex-col">
        <For each={sequence(0, 10)}>
          {(tens) => (
            <div class="flex flex-row">
              <For each={sequence(0, 10)}>
                {(ones) => (
                  <div class="h-8 w-8">
                    {tens}
                    {ones}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
