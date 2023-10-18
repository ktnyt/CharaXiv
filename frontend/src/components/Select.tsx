import { Component } from "solid-js";
import { Icon, SolidChevronDown } from "./Icon";

export type SelectProps = {};

export const Select: Component<SelectProps> = (props) => {
  return (
    <div class="select-none overflow-y-visible">
      <div class="flex h-8 cursor-pointer flex-row items-center divide-x divide-nord-300 rounded border border-nord-300 dark:divide-nord-700 dark:border-nord-700">
        <div class="w-32 px-2">selection</div>
        <div class="flex h-5 w-8 items-center justify-center">
          <Icon of={SolidChevronDown} />
        </div>
      </div>
    </div>
  );
};
