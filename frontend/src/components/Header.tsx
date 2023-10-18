import { A } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";
import { Icon, SolidLayerGroup } from "./Icon";

export const Header: ParentComponent = (props) => (
  <header class="flex h-12 w-screen flex-row items-center justify-between bg-nord-0 px-2 text-nord-1000 transition dark:bg-nord-1000 dark:text-nord-0">
    <A
      href="/"
      class="align-center inline-block text-center text-2xl font-medium leading-6"
    >
      <Icon of={SolidLayerGroup} />
      <Logo class="ml-2 hidden h-4 sm:inline-block" />
    </A>

    <div class="flex flex-row justify-around space-x-2">{props.children}</div>
  </header>
);
