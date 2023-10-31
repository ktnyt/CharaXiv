import { Component, createEffect } from "solid-js";
import {
  PARAMETER_DEFAULT_ZERO,
  PARAMETER_EMOJI,
  PARAMETER_FORMULA,
  PARAMETER_RANGE,
  ParameterKey,
  Variables,
} from "../types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";

export type ParameterProps = {
  key: ParameterKey;
  value?: number;
  variables: Variables;
  atUpdate: (value?: number) => void;
};

export const Parameter: Component<ParameterProps> = (props) => {
  const [min, max] = PARAMETER_RANGE[props.key];
  const limit = () => PARAMETER_FORMULA[props.key](props.variables);
  const value = () =>
    props.value ?? (PARAMETER_DEFAULT_ZERO[props.key] ? 0 : limit());

  const atUpdate = (index: number) =>
    props.atUpdate(index === limit() ? undefined : index);

  createEffect(() => {
    if (limit() < value()) {
      props.atUpdate(undefined);
    }
  });

  return (
    <>
      <Twemoji>{PARAMETER_EMOJI[props.key]}</Twemoji>

      <span class="text-center font-semibold">{props.key}</span>

      <SlideSelector index={value()} atCommit={atUpdate}>
        <Sequence min={0} max={limit()} />
      </SlideSelector>

      <SlideSelector index={limit() - min}>
        <Sequence min={min} max={max} />
      </SlideSelector>
    </>
  );
};
