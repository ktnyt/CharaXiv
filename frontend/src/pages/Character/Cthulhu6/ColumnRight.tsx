import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Section } from "@charaxiv/components/Section";
import { For, createEffect, createSignal } from "solid-js";

export const ColumnRight = () => {
  const [getValue, setValue] = createSignal(0);
  createEffect(() => console.log(getValue()));
  return (
    <div>
      <Section class="flex flex-col w-full">
        <div class="flex flex-col justify-center w-full">
          <SlideSelector value={getValue()} commit={(value) => setValue(value)}>
            <For each={[...new Array(100)].map((_, index) => index)}>
              {(index) => <div>{index}</div>}
            </For>
          </SlideSelector>
          <SlideSelector
            value={Math.floor(getValue() / 10)}
            commit={(value) => setValue((prev) => value * 10 + (prev % 10))}
          >
            <For each={[...new Array(10)].map((_, index) => `${index}0`)}>
              {(index) => <div>{index}</div>}
            </For>
          </SlideSelector>
        </div>
      </Section>
    </div>
  );
};
