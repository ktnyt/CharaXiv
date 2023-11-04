import { Component, createEffect } from "solid-js";
import {
  MUTABLE_DEFAULT_ZERO,
  MUTABLE_EMOJI,
  MUTABLE_FORMULAE,
  MutableKey,
  Variables,
} from "../types";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";

export type ParameterProps = {
  key: MutableKey;
  value?: number;
  variables: Variables;
  atUpdate: (value?: number) => void;
};

export const Parameter: Component<ParameterProps> = (props) => {
  const limit = () => MUTABLE_FORMULAE[props.key](props.variables);
  const fallback = () => (MUTABLE_DEFAULT_ZERO[props.key] ? 0 : limit());
  const value = () => props.value ?? fallback();

  const atUpdate = (index: number) =>
    props.atUpdate(index === fallback() ? undefined : index);

  createEffect(() => {
    if (limit() < value()) {
      props.atUpdate(undefined);
    }
  });

  return (
    <>
      <Twemoji>{MUTABLE_EMOJI[props.key]}</Twemoji>

      <span class="text-center font-semibold">{props.key}</span>

      <SlideSelector index={value()} atCommit={atUpdate}>
        <Sequence min={0} max={limit()} />
      </SlideSelector>
    </>
  );
};
