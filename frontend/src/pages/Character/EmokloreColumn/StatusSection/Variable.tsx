import { Component } from "solid-js";
import { VARIABLE_EMOJI, BaseVariableKey } from "../types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";

export type VariableProps = {
  key: BaseVariableKey;
  value: number;
  atUpdate: (value: number) => void;
};

export const Variable: Component<VariableProps> = (props) => {
  return (
    <>
      <Twemoji>{VARIABLE_EMOJI[props.key]}</Twemoji>
      <span class="text-center font-semibold">{props.key}</span>
      <SlideSelector
        index={props.value - 1}
        atCommit={(index) => props.atUpdate(index + 1)}
      >
        <Sequence min={1} max={6} />
      </SlideSelector>
    </>
  );
};
