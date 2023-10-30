import { Component, untrack } from "solid-js";
import { Skills, Status } from "../types";
import { H1 } from "@charaxiv/components/Heading";
import { List } from "./List";
import { isMultiSkill, isSingleSkill } from "../helpers";
import clsx from "clsx";
import { Input } from "@charaxiv/components/Input";

export type SkillsSectionProps = {
  skills: Skills;
  status: Status;
  atUpdate: (skills: Skills) => void;
};

const SKILL_POINTS = [0, 1, 5, 15];

export const SkillsSection: Component<SkillsSectionProps> = (props) => {
  const consumed = () =>
    props.skills.presets
      .flatMap(({ groups }) => groups)
      .flatMap(({ skills }) => skills)
      .flatMap((skill) =>
        isMultiSkill(skill)
          ? skill.genres.map(({ level }) => ({
              name: skill.name,
              exskill: skill.exskill,
              level,
            }))
          : isSingleSkill(skill)
          ? [{ name: skill.name, exskill: skill.exskill, level: skill.level }]
          : [],
      )
      .map(
        ({ name, exskill, level }) => SKILL_POINTS[level] * (exskill ? 2 : 1),
      )
      .reduce((a, b) => a + b, 0);

  const points = () => 30 + props.skills.extra;

  const updateExtra = (value: string) => {
    const extra = Number(value);
    if (isNaN(extra)) return;
    props.atUpdate({
      ...props.skills,
      extra,
    });
  };

  return (
    <div class="flex w-full flex-col gap-2">
      <div class="flex flex-row items-baseline gap-2">
        <H1>技能</H1>

        <span
          class={clsx(
            "text-lg proportional-nums",
            consumed() > points() && "text-red-500",
            consumed() < points() && "text-yellow-500",
          )}
        >
          <span class="justify-self-end p-1">{consumed()} / 30</span>
          <span class="text-center">+</span>
          <Input
            value={untrack(() =>
              props.skills.extra === 0 ? "" : `${props.skills.extra}`,
            )}
            class="w-12 text-lg placeholder:text-lg"
            placeholder="0"
            borderless
            onInput={(event) => updateExtra(event.currentTarget.value)}
          />
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <div class="flex flex-col gap-4 2xl:[&>:nth-child(even)]:hidden">
          <List
            skills={props.skills}
            status={props.status}
            atUpdate={props.atUpdate}
          />
        </div>

        <div class="hidden flex-col gap-4 2xl:flex 2xl:[&>:nth-child(odd)]:hidden">
          <List
            skills={props.skills}
            status={props.status}
            atUpdate={props.atUpdate}
          />
        </div>
      </div>
    </div>
  );
};
