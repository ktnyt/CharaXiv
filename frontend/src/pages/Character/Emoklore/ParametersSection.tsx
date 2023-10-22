import { Component, For } from "solid-js";
import { Variables } from "./types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";

export type ParametersSectionProps = {
  variables: Variables;
};

export const ParameterSection: Component<ParametersSectionProps> = (props) => {
  return (
    <div class="grid grid-cols-[16px_50px_1fr] items-center justify-center">
      <Twemoji>❤️</Twemoji>
      <span>HP</span>
      <SlideSelector index={props.variables["身体"] - 1} readonly>
        <For each={sequence(11, 17)}>{(value) => <div>{value}</div>}</For>
      </SlideSelector>
      <Twemoji>🪄</Twemoji>
      <span>MP</span>
      <SlideSelector
        index={props.variables["知力"] + props.variables["精神"] - 2}
        readonly
      >
        <For each={sequence(2, 12)}>{(value) => <div>{value}</div>}</For>
      </SlideSelector>
    </div>
  );
};
