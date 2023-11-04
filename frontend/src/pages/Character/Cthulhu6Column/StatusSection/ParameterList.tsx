import { Component, Index } from "solid-js";
import { PARAMETER_KEYS, ParameterKey, Parameters, Variables } from "../types";
import { Parameter } from "./Parameter";

export type ParameterListProps = {
  parameters: Parameters;
  variables: Variables;
  atUpdate: (parameters: Parameters) => void;
};

export const ParameterList: Component<ParameterListProps> = (props) => {
  const parameterList = () =>
    PARAMETER_KEYS.map((key) => ({ key, value: props.parameters[key] }));

  const updateParameter = (key: ParameterKey) => (value?: number) =>
    props.atUpdate({
      ...props.parameters,
      [key]: value,
    });

  return (
    <div class="grid grid-cols-[max-content_32px] items-center justify-center gap-x-2 px-8">
      <Index each={parameterList()}>
        {(item) => <Parameter key={item().key} variables={props.variables} />}
      </Index>
    </div>
  );
};
