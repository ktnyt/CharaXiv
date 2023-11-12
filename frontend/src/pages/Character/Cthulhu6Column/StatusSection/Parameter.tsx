import { Component } from "solid-js";
import {
  PARAMETER_FORMULA,
  ParameterKey,
  VARIABLE_MAX,
  VARIABLE_MIN,
  Variables,
} from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";

export type ParameterProps = {
  key: ParameterKey;
  variables: Variables;
};

export const Parameter: Component<ParameterProps> = (props) => {
  const min = () => PARAMETER_FORMULA[props.key](VARIABLE_MIN);
  const max = () => PARAMETER_FORMULA[props.key](VARIABLE_MAX);
  const value = () => PARAMETER_FORMULA[props.key](props.variables);

  return (
    <div class="grid grid-cols-[auto_32px] items-center justify-between">
      <span class="text-center font-semibold">{props.key}</span>

      <SlideSelector index={value() - min()} readonly>
        <Sequence min={min()} max={max()} class="text-sm" />
      </SlideSelector>
    </div>
  );
};
