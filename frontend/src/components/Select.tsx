import { For, JSX, Show, createSignal } from "solid-js";
import { Icon, SolidChevronDown } from "./Icon";
import { Tap } from "./Tap";
import { Modal } from "./Modal";
import { Button } from "./Button";

export type SelectProps<T> = {
  index: number;
  options: T[];
  renderSelect: (option: T) => string;
  renderOption: (option: T, index: number) => string;
  atSelect: (index: number) => void;
};

export const Select = <T extends unknown>(
  props: SelectProps<T>,
): JSX.Element => {
  const [open, openSet] = createSignal(false);

  const selectHandle = (index: number) => () => {
    openSet(false);
    props.atSelect(index);
  };

  return (
    <div class="h-8 select-none overflow-y-visible">
      <Tap onTap={() => openSet((prev) => !prev)}>
        {(tapProps) => (
          <div
            class="flex h-8 cursor-pointer flex-row items-center divide-x divide-nord-300 rounded border border-nord-300 dark:divide-nord-700 dark:border-nord-700"
            {...tapProps}
          >
            <div class="w-32 px-2 text-center text-sm">
              {props.renderSelect(props.options[props.index])}
            </div>
            <div class="flex h-5 w-8 items-center justify-center">
              <Icon of={SolidChevronDown} />
            </div>
          </div>
        )}
      </Tap>
      <Show when={open()}>
        <Modal atClose={() => openSet(false)}>
          <div class="flex max-h-[90vw] w-[90vw] max-w-xs flex-col gap-2 divide-x divide-nord-500 rounded bg-nord-100 p-2 dark:bg-nord-900">
            <For each={props.options}>
              {(option, index) => (
                <Button
                  variant="textual"
                  color={props.index === index() ? "blue" : "default"}
                  onClick={selectHandle(index())}
                >
                  {props.renderOption(option, index())}
                </Button>
              )}
            </For>
          </div>
        </Modal>
      </Show>
    </div>
  );
};
