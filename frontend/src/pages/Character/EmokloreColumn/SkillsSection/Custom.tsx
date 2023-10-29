import { Component, For, Show } from "solid-js";
import { CustomSkill, Status, VARIABLE_EMOJI, VARIABLE_KEYS } from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";
import { Input } from "@charaxiv/components/Input";
import { Twemoji } from "@charaxiv/components/Twemoji";

export type CustomProps = {
  skill: CustomSkill;
  status: Status;
  disabled: boolean;
  hideInit: boolean;
  atUpdate: (skill: CustomSkill) => void;
};

export const Custom: Component<CustomProps> = (props) => {
  const updateName = (name: string) => props.atUpdate({ ...props.skill, name });

  const updateLevel = (level: number) =>
    props.atUpdate({ ...props.skill, level });

  return (
    <Show when={!props.hideInit || props.skill.level > 0}>
      <div class="grid grid-cols-[100px_1fr_32px_32px]">
        <div>
          <Input
            placeholder={props.skill.name}
            borderless
            onInput={(event) => updateName(event.currentTarget.value)}
          />
        </div>

        <SlideSelector index={props.skill.level} atCommit={updateLevel}>
          <Sequence max={3} />
        </SlideSelector>

        <SlideSelector
          index={props.status.variables[props.skill.base] + props.skill.level}
          readonly
        >
          <Sequence max={9} />
        </SlideSelector>

        <SlideSelector index={VARIABLE_KEYS.indexOf(props.skill.base)} readonly>
          <For each={VARIABLE_KEYS}>
            {(key) => (
              <span>
                <Twemoji>{VARIABLE_EMOJI[key]}</Twemoji>
              </span>
            )}
          </For>
        </SlideSelector>
      </div>
    </Show>
  );
};
