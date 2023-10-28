import { Component, For, Index, Show } from "solid-js";
import { SkillCategory, Skills, Status } from "../types";
import { replace } from "@charaxiv/components/utils";
import { Category } from "./Category";
import { H1 } from "@charaxiv/components/Heading";

export type SkillsSectionProps = {
  skills: Skills;
  status: Status;
  atUpdate: (skills: Skills) => void;
};

export const SkillsSection: Component<SkillsSectionProps> = (props) => {
  const updateCategorySkill = (index: number) => (category: SkillCategory) =>
    props.atUpdate({
      ...props.skills,
      presets: replace(props.skills.presets, index, category),
    });

  return (
    <div class="flex flex-col gap-2">
      <H1>技能</H1>

      <div class="flex flex-col gap-4">
        <Index each={props.skills.presets}>
          {(category, index) => (
            <Category
              category={category()}
              status={props.status}
              atUpdate={updateCategorySkill(index)}
            />
          )}
        </Index>
      </div>
    </div>
  );
};
