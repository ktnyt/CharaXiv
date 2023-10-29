import { Component } from "solid-js";
import { VARIABLE_EMOJI, VariableKey } from "../types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";

export type VariableProps = {
  key: VariableKey;
  value: number;
  atUpdate: (value: number) => void;
};

export const Variable: Component<VariableProps> = (props) => {
  return (
    <>
      <Twemoji>{VARIABLE_EMOJI[props.key]}</Twemoji>
      <span class="text-center font-semibold">{props.key}</span>
      <SlideSelector index={props.value - 1} atCommit={props.atUpdate}>
        <Sequence min={1} max={6} />
      </SlideSelector>
    </>
  );
};
