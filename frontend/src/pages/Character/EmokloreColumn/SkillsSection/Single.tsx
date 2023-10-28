import { Component, For, Show } from "solid-js";
import { EX_SKILLS, SingleSkill, Status, VARIABLE_EMOJI } from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";
import { maxVariableKey } from "../helpers";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { Sequence } from "@charaxiv/components/Sequence";

export type SingleProps = {
  skill: SingleSkill;
  status: Status;
  disabled: boolean;
  hideInit: boolean;
  atUpdate: (skill: SingleSkill) => void;
};

export const Single: Component<SingleProps> = (props) => {
  const variableKey = () => maxVariableKey(props.status, props.skill.bases);

  const nameLabel = (name: string) =>
    EX_SKILLS.includes(name) ? `★${name}` : name;

  const updateLevel = (index: number) =>
    props.atUpdate({ ...props.skill, level: index });

  return (
    <Show when={!props.hideInit || props.skill.level > 0}>
      <div class="grid grid-cols-[100px_1fr_32px_32px]">
        <span class="align-baseline font-semibold leading-8">
          {nameLabel(props.skill.name)}
        </span>

        <SlideSelector index={props.skill.level} atCommit={updateLevel}>
          <Sequence max={3} />
        </SlideSelector>

        <SlideSelector
          index={props.status.variables[variableKey()] + props.skill.level}
          readonly
        >
          <Sequence max={9} />
        </SlideSelector>

        <SlideSelector
          index={props.skill.bases.indexOf(variableKey())}
          readonly
        >
          <For each={props.skill.bases}>
            {(base) => (
              <span>
                <Twemoji>{VARIABLE_EMOJI[base]}</Twemoji>
              </span>
            )}
          </For>
        </SlideSelector>
      </div>
    </Show>
  );
};
