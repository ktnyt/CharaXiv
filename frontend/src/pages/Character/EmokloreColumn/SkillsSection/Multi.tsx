import { Component, For, Index, Show } from "solid-js";
import {
  EX_SKILLS,
  MultiSkill,
  SkillGenre,
  Status,
  VARIABLE_EMOJI,
} from "../types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { replace, sequence } from "@charaxiv/components/utils";
import { maxVariableKey } from "../helpers";
import { Twemoji } from "@charaxiv/components/Twemoji";
import { Button } from "@charaxiv/components/Button";
import { Genre } from "./Genre";
import { Sequence } from "@charaxiv/components/Sequence";

export type MultiProps = {
  skill: MultiSkill;
  status: Status;
  disabled: boolean;
  hideInit: boolean;
  atUpdate: (skill: MultiSkill) => void;
};

export const Multi: Component<MultiProps> = (props) => {
  const variableKey = () => maxVariableKey(props.status, props.skill.bases);

  const updateGenre = (index: number) => (genre: SkillGenre) =>
    props.atUpdate({
      ...props.skill,
      genres: replace(props.skill.genres, index, genre),
    });

  const deleteGenre = (index: number) =>
    props.atUpdate({
      ...props.skill,
      genres: props.skill.genres.filter((_, i) => index !== i),
    });

  const addGenre = () =>
    props.atUpdate({
      ...props.skill,
      genres: [...props.skill.genres, { label: "", level: 0 }],
    });

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        <div class="grid grid-cols-[1fr_32px_32px]">
          <span class="align-baseline font-semibold leading-8">
            {props.skill.name}
          </span>
          <SlideSelector index={props.status.variables[variableKey()] - 1}>
            <Sequence min={1} max={6} />
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

        <Index each={props.skill.genres}>
          {(genre, index) => (
            <Genre
              name={props.skill.name}
              genre={genre()}
              status={props.status}
              base={variableKey()}
              atUpdate={updateGenre(index)}
              atDelete={() => deleteGenre(index)}
            />
          )}
        </Index>
      </div>

      <div class="w-full px-2 pb-2">
        <Button variant="outline" color="blue" fullWidth onClick={addGenre}>
          {props.skill.name}を追加
        </Button>
      </div>
    </div>
  );
};
