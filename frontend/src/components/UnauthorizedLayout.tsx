import { CATCH_COPY } from "@charaxiv/constants";
import { ParentComponent } from "solid-js";
import { Article } from "./Article";
import { Logo } from "./Logo";
import { Section } from "./Section";

export const UnauthenticatedLayout: ParentComponent = (props) => (
  <Article class="flex justify-center items-start">
    <Section class="flex flex-col sm:flex-row flex-wrap justify-center items-center sm:divide-x p-2 rounded shadow divide-nord-300 dark:divide-nord-700">
      <div class="flex flex-col w-[300px] text-center py-8">
        <Logo class="h-8 m-2" />
        <span class="text-sm">{CATCH_COPY}</span>
      </div>

      <div class="flex justify-center w-[300px] p-2">
        <div class="flex flex-col space-y-2 justify-center w-[90%]">
          {props.children}
        </div>
      </div>
    </Section>
  </Article>
);
