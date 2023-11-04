import { Component } from "solid-js";
import { VARIABLE_DICE, VARIABLE_EMOJI, VariableKey } from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";
import { Twemoji } from "@charaxiv/components/Twemoji";

export type VariableProps = {
  key: VariableKey;
  value: number;
  atUpdate: (value: number) => void;
};

export const Variable: Component<VariableProps> = (props) => {
  const min = VARIABLE_DICE[props.key]
    .map((die) => die.min)
    .reduce((a, b) => a + b, 0);
  const max = VARIABLE_DICE[props.key]
    .map((die) => die.max)
    .reduce((a, b) => a + b, 0);
  return (
    <>
      <span>
        <Twemoji>{VARIABLE_EMOJI[props.key]}</Twemoji>
      </span>
      <span class="text-center font-semibold">{props.key}</span>
      <SlideSelector
        index={props.value - min}
        atCommit={(index) => props.atUpdate(index + min)}
      >
        <Sequence min={min} max={max} />
      </SlideSelector>
    </>
  );
};
