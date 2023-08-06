import { A } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

export const Header: ParentComponent = (props) => (
  <header class="flex flex-row justify-between items-center w-screen h-12 px-2 bg-nord-0 text-nord-1000 transition dark:bg-nord-1000 dark:text-nord-0">
    <A
      href="/"
      class="inline-block font-medium text-2xl leading-6 text-center align-center"
    >
      <i class="fas fa-layer-group" />
      <Logo class="ml-2 hidden sm:inline-block h-4" />
    </A>

    <div class="flex flex-row justify-around space-x-2">
      {props.children}

      <IconButton variant="textual" color="default">
        <i class="fas fa-moon" />
      </IconButton>
    </div>
  </header>
);
