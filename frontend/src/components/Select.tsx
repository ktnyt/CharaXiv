import { Component, For, Show, createSignal } from "solid-js";
import { Icon, SolidChevronDown } from "./Icon";
import { Tap } from "./Tap";
import { Modal } from "./Modal";
import { Button } from "./Button";

export type SelectProps = {
  value: string;
  options: { value: string; label: string }[];
  atSelect: (value: string) => void;
};

export const Select: Component<SelectProps> = (props) => {
  const [open, openSet] = createSignal(false);
  const selected = () =>
    props.options.find(({ value }) => value === props.value) ?? {
      value: "",
      label: "",
    };

  const selectHandle = (value: string) => {
    openSet(false);
    props.atSelect(value);
  };

  return (
    <div class="h-8 select-none overflow-y-visible">
      <Tap onTap={() => openSet((prev) => !prev)}>
        {(tapProps) => (
          <div
            class="flex h-8 cursor-pointer flex-row items-center divide-x divide-nord-300 rounded border border-nord-300 dark:divide-nord-700 dark:border-nord-700"
            {...tapProps}
          >
            <div class="w-32 px-2 text-center text-sm">{selected().label}</div>
            <div class="flex h-5 w-8 items-center justify-center">
              <Icon of={SolidChevronDown} />
            </div>
          </div>
        )}
      </Tap>
      <Show when={open()}>
        <Modal atClose={() => openSet(false)}>
          <div class="flex max-h-[90vw] w-[90vw] flex-col gap-2 rounded bg-nord-100 p-2 dark:bg-nord-900">
            <For each={props.options}>
              {({ value, label }) => (
                <Button
                  variant="textual"
                  color={props.value === value ? "blue" : "default"}
                  onClick={() => selectHandle(value)}
                >
                  {label}
                </Button>
              )}
            </For>
          </div>
        </Modal>
      </Show>
    </div>
  );
};
