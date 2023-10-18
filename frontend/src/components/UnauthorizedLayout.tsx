import { CATCH_COPY } from "@charaxiv/constants";
import { ParentComponent } from "solid-js";
import { Article } from "./Article";
import { Logo } from "./Logo";
import { Section } from "./Section";

export const UnauthenticatedLayout: ParentComponent = (props) => (
  <Article class="flex items-start justify-center">
    <Section class="flex flex-col flex-wrap items-center justify-center divide-nord-300 rounded p-2 shadow dark:divide-nord-700 sm:flex-row sm:divide-x">
      <div class="flex w-[300px] flex-col py-8 text-center">
        <Logo class="m-2 h-8" />
        <span class="text-sm">{CATCH_COPY}</span>
      </div>

      <div class="flex w-[300px] justify-center p-2">
        <div class="flex w-[90%] flex-col justify-center space-y-2">
          {props.children}
        </div>
      </div>
    </Section>
  </Article>
);
