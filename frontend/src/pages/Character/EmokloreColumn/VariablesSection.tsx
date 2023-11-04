import { Component, For } from "solid-js";
import {
  VARIABLE_EMOJI,
  VARIABLE_KEYS,
  BaseVariableKey,
  BaseVariables,
} from "./types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";
import { H1 } from "@charaxiv/components/Heading";
import { Sequence } from "@charaxiv/components/Sequence";
import { Fragment } from "@charaxiv/components/Fragment";

export type VariablesSectionType = {
  variables: BaseVariables;
  atUpdate: (variables: BaseVariables) => void;
};

export const VariablesSection: Component<VariablesSectionType> = (props) => {
  const variableChangeHandle = (key: BaseVariableKey) => (index: number) =>
    props.atUpdate({ ...props.variables, [key]: index + 1 });

  return (
    <div class="flex flex-col gap-2">
      <H1>能力値</H1>

      <div class="grid max-w-xs grid-cols-[16px_50px_1fr] items-center justify-center px-8">
        <For each={VARIABLE_KEYS}>
          {(key) => (
            <>
              <Twemoji>{VARIABLE_EMOJI[key]}</Twemoji>
              <span class="text-center font-semibold">{key}</span>
              <SlideSelector
                index={props.variables[key] - 1}
                atCommit={variableChangeHandle(key)}
              >
                <Sequence min={1} max={6} />
              </SlideSelector>
            </>
          )}
        </For>

        <Fragment>
          <Twemoji>❤️</Twemoji>
          <span class="text-center font-semibold">HP</span>
          <SlideSelector index={props.variables["身体"] - 1} readonly>
            <Sequence min={11} max={16} />
          </SlideSelector>
        </Fragment>

        <Fragment>
          <Twemoji>🪄</Twemoji>
          <span class="text-center font-semibold">MP</span>
          <SlideSelector
            index={props.variables["知力"] + props.variables["精神"] - 2}
            readonly
          >
            <Sequence min={2} max={12} />
          </SlideSelector>
        </Fragment>
      </div>
    </div>
  );
};
