import { Component, For, Show } from "solid-js";
import {
  CustomSkill,
  Status,
  VARIABLE_EMOJI,
  VARIABLE_KEYS,
  VariableKey,
} from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Sequence } from "@charaxiv/components/Sequence";
import { Input } from "@charaxiv/components/Input";
import { Twemoji } from "@charaxiv/components/Twemoji";
import {
  Icon,
  RegularStar,
  SolidStar,
  SolidTrashAlt,
} from "@charaxiv/components/Icon";
import { IconButton } from "@charaxiv/components/IconButton";
import { atConfirm } from "@charaxiv/components/utils";
import { Either } from "@charaxiv/components/Either";

export type CustomProps = {
  skill: CustomSkill;
  status: Status;
  disabled: boolean;
  hideInit: boolean;
  atUpdate: (skill: CustomSkill) => void;
  atDelete: () => void;
};

export const Custom: Component<CustomProps> = (props) => {
  const updateExskill = (exskill: boolean) =>
    props.atUpdate({ ...props.skill, exskill });

  const updateName = (name: string) => props.atUpdate({ ...props.skill, name });

  const updateLevel = (level: number) =>
    props.atUpdate({ ...props.skill, level });

  const updateBase = (base: VariableKey) =>
    props.atUpdate({ ...props.skill, base });

  return (
    <Show when={!props.hideInit || props.skill.level > 0}>
      <div class="grid grid-cols-[32px_100px_1fr_32px_32px_32px] items-center">
        <div class="text-center">
          <IconButton
            variant="textual"
            color={props.skill.exskill ? "yellow" : "default"}
            onClick={() => updateExskill(!props.skill.exskill)}
          >
            <Either when={props.skill.exskill}>
              <Icon of={SolidStar} />
              <Icon of={RegularStar} />
            </Either>
          </IconButton>
        </div>

        <div>
          <Input
            placeholder={props.skill.name || "独自技能"}
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

        <SlideSelector
          index={VARIABLE_KEYS.indexOf(props.skill.base)}
          atCommit={(index) => updateBase(VARIABLE_KEYS[index])}
        >
          <For each={VARIABLE_KEYS}>
            {(key) => (
              <span>
                <Twemoji>{VARIABLE_EMOJI[key]}</Twemoji>
              </span>
            )}
          </For>
        </SlideSelector>

        <div>
          <IconButton
            variant="outline"
            color="red"
            onClick={() =>
              atConfirm(
                `この操作は元に戻せません。\n本当に独自技能「${
                  props.skill.name || "無名の技能"
                }」を削除しますか？`,
                props.atDelete,
              )
            }
          >
            <Icon of={SolidTrashAlt} />
          </IconButton>
        </div>
      </div>
    </Show>
  );
};
