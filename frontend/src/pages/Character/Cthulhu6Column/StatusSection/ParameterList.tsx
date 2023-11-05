import { Component, Index } from "solid-js";
import { PARAMETER_KEYS, ParameterKey, Parameters, Variables } from "../types";
import { Parameter } from "./Parameter";
import { DamageBonus } from "./DamageBonus";

export type ParameterListProps = {
  parameters: Parameters;
  variables: Variables;
};

export const ParameterList: Component<ParameterListProps> = (props) => {
  const parameterList = () =>
    PARAMETER_KEYS.map((key) => ({ key, value: props.parameters[key] }));

  return (
    <div class="grid grid-cols-[1fr_32px_1fr_32px] items-center justify-center gap-x-2">
      <Index each={parameterList()}>
        {(item) => <Parameter key={item().key} variables={props.variables} />}
      </Index>
      <DamageBonus variables={props.variables} />
    </div>
  );
};
