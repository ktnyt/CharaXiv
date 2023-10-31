import { Component, Index } from "solid-js";
import { VARIABLE_KEYS, VariableKey, Variables } from "../types";
import { Variable } from "./Variable";

export type VariableListProps = {
  variables: Variables;
  atUpdate: (variables: Variables) => void;
};

export const VariableList: Component<VariableListProps> = (props) => {
  const variableList = () =>
    VARIABLE_KEYS.map((key) => ({ key, value: props.variables[key] }));

  const updateVariable = (key: VariableKey) => (value: number) =>
    props.atUpdate({
      ...props.variables,
      [key]: value,
    });

  return (
    <div class="grid grid-cols-[16px_50px_1fr_32px] items-center justify-center px-8">
      <Index each={variableList()}>
        {(item) => (
          <>
            <Variable
              key={item().key}
              value={item().value}
              atUpdate={updateVariable(item().key)}
            />
            <div></div>
          </>
        )}
      </Index>
    </div>
  );
};
