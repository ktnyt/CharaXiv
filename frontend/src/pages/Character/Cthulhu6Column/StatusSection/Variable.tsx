import { Component, For, untrack } from "solid-js";
import {
  VARIABLE_DICE,
  VariableKey,
  VariableValue,
  computeVariable,
} from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";
import { Input } from "@charaxiv/components/Input";
import { Either } from "@charaxiv/components/Either";

export type VariableProps = {
  key: VariableKey;
  value: VariableValue;
  atUpdate: (value: VariableValue) => void;
};

export const Variable: Component<VariableProps> = (props) => {
  const value = () => computeVariable(props.value);
  const min = () =>
    VARIABLE_DICE[props.key].map((die) => die.min).reduce((a, b) => a + b, 0);
  const max = () =>
    VARIABLE_DICE[props.key].map((die) => die.max).reduce((a, b) => a + b, 0);

  const updateBase = (base: number) =>
    props.atUpdate({
      ...props.value,
      base,
    });

  const updateTmp = (value: string) => {
    const tmp = Number(value);
    if (!isNaN(tmp)) {
      props.atUpdate({
        ...props.value,
        tmp: tmp,
      });
    }
  };

  const updateAdj = (value: string) => {
    const adj = Number(value);
    if (!isNaN(adj)) {
      props.atUpdate({
        ...props.value,
        adj,
      });
    }
  };

  const emptyZero = (n: number) => (n === 0 ? "" : `${n}`);

  return (
    <>
      <span class="flex justify-between overflow-clip font-semibold">
        <For each={props.key.split("")}>{(c) => <span>{c}</span>}</For>
      </span>

      <div class="mx-2">
        <SlideSelector
          index={props.value.base - min()}
          atCommit={(value) => updateBase(value + min())}
        >
          <Sequence min={min()} max={max()} />
        </SlideSelector>
      </div>

      <span>+</span>
      <Input
        value={emptyZero(untrack(() => props.value.adj))}
        onInput={(event) => updateTmp(event.currentTarget.value)}
        placeholder="増減"
        borderless
      />
      <span>+</span>
      <Input
        value={emptyZero(untrack(() => props.value.tmp))}
        onInput={(event) => updateAdj(event.currentTarget.value)}
        placeholder="一時"
        borderless
      />
      <span>=</span>

      <Either when={value() < 100}>
        <SlideSelector index={value()} readonly>
          <Sequence min={0} max={99} />
        </SlideSelector>
        <div class="w-8 h-8 flex justify-items items-center font-semibold proportional-nums leading-8">{value()}</div>
      </Either>
    </>
  );
};
