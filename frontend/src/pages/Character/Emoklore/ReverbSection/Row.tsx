import { IconButton, IconButtonProps } from "@charaxiv/components/IconButton";
import clsx from "clsx";
import { Component, ComponentProps, splitProps } from "solid-js";
import { Reverb } from "../types";
import { Input, InputProps } from "@charaxiv/components/Input";
import { ButtonProps } from "@charaxiv/components/Button";
import { Either } from "@charaxiv/components/Either";
import {
  Icon,
  RegularCheckSquare,
  RegularSquare,
  SolidTrashAlt,
} from "@charaxiv/components/Icon";

export type RowProps = {
  scenario: string;
  emotion: string;
  consumed: boolean;
  atUpdate: (reverb: Reverb) => void;
  atDelete: () => void;
};

export const Row: Component<RowProps> = (props) => {
  const [handlers, reverb] = splitProps(props, ["atUpdate", "atDelete"]);
  const reverbConsumeHandle: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    handlers.atUpdate({
      ...reverb,
      consumed: !reverb.consumed,
    });
  };

  const reverbScenarioHandle: InputProps["onInput"] = (event) => {
    handlers.atUpdate({ ...reverb, scenario: event.currentTarget.value });
  };

  const reverbEmotionHandle: InputProps["onInput"] = (event) => {
    handlers.atUpdate({ ...reverb, emotion: event.currentTarget.value });
  };

  const deleteHandle: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    handlers.atDelete();
  };

  return (
    <div class="grid w-full grid-cols-[32px,_1fr,_100px_32px]">
      <IconButton variant="textual" onClick={reverbConsumeHandle}>
        <Either when={reverb.consumed}>
          <Icon of={RegularCheckSquare} />
          <Icon of={RegularSquare} />
        </Either>
      </IconButton>

      <div class="w-full">
        <Input
          placeholder="シナリオ名"
          borderless
          value={reverb.scenario}
          onInput={reverbScenarioHandle}
        />
      </div>

      <div>
        <Input
          placeholder="感情"
          borderless
          value={reverb.emotion}
          onInput={reverbEmotionHandle}
        />
      </div>

      <IconButton variant="outline" color="red" onClick={deleteHandle}>
        <Icon of={SolidTrashAlt} />
      </IconButton>
    </div>
  );
};
