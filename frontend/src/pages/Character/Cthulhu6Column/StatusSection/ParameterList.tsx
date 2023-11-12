import { Component, Index, createSignal, onCleanup, onMount } from "solid-js";
import { PARAMETER_KEYS, Parameters, Variables } from "../types";
import { Parameter } from "./Parameter";
import { DamageBonus } from "./DamageBonus";
import clsx from "clsx";

export type ParameterListProps = {
  parameters: Parameters;
  variables: Variables;
};

export const ParameterList: Component<ParameterListProps> = (props) => {
  const parameterList = () =>
    PARAMETER_KEYS.map((key) => ({ key, value: props.parameters[key] }));

  return (
    <div class="xs:gap-x-4 grid w-full grid-cols-3 justify-between gap-x-2">
      <Index each={parameterList()}>
        {(item) => <Parameter key={item().key} variables={props.variables} />}
      </Index>
      <DamageBonus variables={props.variables} />
    </div>
  );
};
