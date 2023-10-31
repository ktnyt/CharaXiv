import { Component, Index } from "solid-js";
import { PARAMETER_KEYS, ParameterKey, Parameters, Variables } from "../types";
import { Parameter } from "./Parameter";

export type ParameterListProps = {
  parameters: Partial<Parameters>;
  variables: Variables;
  atUpdate: (parameters: Partial<Parameters>) => void;
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
    <div class="grid grid-cols-[16px_50px_1fr_32px] items-center justify-center px-8">
      <Index each={parameterList()}>
        {(item) => (
          <Parameter
            key={item().key}
            value={item().value}
            variables={props.variables}
            atUpdate={updateParameter(item().key)}
          />
        )}
      </Index>
    </div>
  );
};
