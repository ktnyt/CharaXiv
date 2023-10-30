import { Component, For } from "solid-js";
import { Status, VARIABLE_EMOJI, VariableKey } from "../types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";
import { Sequence } from "@charaxiv/components/Sequence";

export type BaseProps = {
  name: string;
  base: VariableKey;
  status: Status;
};

export const Base: Component<BaseProps> = (props) => (
  <div class="grid grid-cols-[1fr_32px_32px] items-center">
    <span class="align-baseline font-semibold leading-8">{props.name}</span>

    <SlideSelector index={props.status.variables[props.base] - 1} readonly>
      <Sequence min={1} max={6} />
    </SlideSelector>

    <span class="text-center">
      <Twemoji>{VARIABLE_EMOJI[props.base]}</Twemoji>
    </span>
  </div>
);
