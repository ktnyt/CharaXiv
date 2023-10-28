import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Section } from "@charaxiv/components/Section";
import { For, createSignal } from "solid-js";

export const ColumnRight = () => {
  const [getValue, setValue] = createSignal(0);
  return (
    <div>
      <Section class="flex w-full flex-col">
        <div class="flex w-full flex-col justify-center">
          <SlideSelector
            index={getValue()}
            atCommit={(value) => setValue(value)}
          >
            <For each={[...new Array(100)].map((_, index) => index)}>
              {(index) => <div>{index}</div>}
            </For>
          </SlideSelector>
          <SlideSelector
            index={Math.floor(getValue() / 10)}
            atCommit={(value) => setValue((prev) => value * 10 + (prev % 10))}
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
