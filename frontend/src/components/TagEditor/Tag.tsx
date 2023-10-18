import clsx from "clsx";
import { JSX, Show, splitProps } from "solid-js";
import { DragChildProps } from "../Drag";
import { Icon, SolidTimes } from "../Icon";

export type TagProps = {
  readonly?: boolean;
  selected?: boolean;
  atDelete?: () => void;
  children: JSX.Element;
} & Partial<DragChildProps<HTMLDivElement>>;

export const Tag = (props: TagProps): JSX.Element => {
  const [tagProps, dragProps] = splitProps(props, [
    "readonly",
    "selected",
    "atDelete",
    "children",
  ]);
  const selected = () => tagProps.selected ?? false;
  return (
    <div
      class={clsx(
        "flex cursor-grab flex-row rounded-sm text-center text-base proportional-nums leading-4 transition",
        selected()
          ? "bg-nord-150 text-nord-1000 dark:bg-nord-850 dark:text-nord-0"
          : "bg-nord-100 text-nord-1000 dark:bg-nord-900 dark:text-nord-0",
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        class={clsx(tagProps.readonly ?? false ? "px-1.5" : "pl-1.5", "py-1")}
        {...dragProps}
      >
        <span class="inline-block ">{tagProps.children}</span>
      </div>
      <Show when={!(tagProps.readonly ?? false)}>
        <button
          class={clsx(
            "flex aspect-square h-6 items-center justify-center rounded-sm transition",
            selected()
              ? "bg-nord-150 text-nord-800 hover:bg-nord-200 dark:bg-nord-850 dark:text-nord-200 dark:hover:bg-nord-800"
              : "bg-nord-100 text-nord-800 hover:bg-nord-150 dark:bg-nord-900 dark:text-nord-200 dark:hover:bg-nord-850",
          )}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (tagProps.atDelete) tagProps.atDelete();
          }}
        >
          <Icon of={SolidTimes} />
        </button>
      </Show>
    </div>
  );
};
