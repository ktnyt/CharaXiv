import { Component, For } from "solid-js";
import { VARIABLE_EMOJI, VARIABLE_KEYS, VariableKey, Variables } from "./types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";

export type VariablesSectionType = {
  variables: Variables;
  atUpdate: (variables: Variables) => void;
};

export const VariablesSection: Component<VariablesSectionType> = (props) => {
  const variableChangeHandle = (key: VariableKey) => (index: number) =>
    props.atUpdate({ ...props.variables, [key]: index + 1 });

  return (
    <div class="grid grid-cols-[16px_50px_1fr] items-center justify-center">
      <For each={VARIABLE_KEYS}>
        {(key) => (
          <>
            <Twemoji>{VARIABLE_EMOJI[key]}</Twemoji>
            <span class="text-center">{key}</span>
            <div>
              <SlideSelector
                index={props.variables[key] - 1}
                atCommit={variableChangeHandle(key)}
              >
                <For each={sequence(1, 7)}>{(value) => <div>{value}</div>}</For>
              </SlideSelector>
            </div>
          </>
        )}
      </For>
    </div>
  );
};
