import { Component, Index } from "solid-js";
import { VARIABLE_KEYS, VariableKey, VariableValue, Variables } from "../types";
import { Variable } from "./Variable";

export type VariableListProps = {
  variables: Variables;
  atUpdate: (variables: Variables) => void;
};

export const VariableList: Component<VariableListProps> = (props) => {
  const variableList = () =>
    VARIABLE_KEYS.map((key) => ({ key, value: props.variables[key] }));

  const updateVariable = (key: VariableKey) => (value: VariableValue) =>
    props.atUpdate({
      ...props.variables,
      [key]: value,
    });

  return (
    <div class="grid w-full grid-cols-[max-content_1fr_auto_48px_auto_48px_auto_32px] items-baseline justify-center">
      <Index each={variableList()}>
        {(item) => (
          <>
            <Variable
              key={item().key}
              value={item().value}
              atUpdate={updateVariable(item().key)}
            />
          </>
        )}
      </Index>
    </div>
  );
};
