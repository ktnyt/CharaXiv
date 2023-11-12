import clsx from "clsx";
import { Component, createSignal } from "solid-js";

export type PickerProps = {};

export const Picker: Component<PickerProps> = (props) => {
  const [active, setActive] = createSignal(false);
  return (
    <div>
      <div
        class={clsx(
          "flex items-center justify-center bg-blue-50 transition-all",
          active() ? "h-16 w-16" : "h-8 w-8",
        )}
        onClick={() => setActive((prev) => !prev)}
      >
        <div>42</div>
      </div>
    </div>
  );
};
