import { Component, Index } from "solid-js";
import { SkillCategory, Skills, Status } from "../types";
import { replace } from "@charaxiv/components/utils";
import { Category } from "./Category";

export type ListProps = {
  skills: Skills;
  status: Status;
  atUpdate: (skills: Skills) => void;
};

export const List: Component<ListProps> = (props) => {
  const updateCategorySkill = (index: number) => (category: SkillCategory) =>
    props.atUpdate({
      ...props.skills,
      presets: replace(props.skills.presets, index, category),
    });

  return (
    <>
      <Index each={props.skills.presets}>
        {(category, index) => (
          <Category
            category={category()}
            status={props.status}
            atUpdate={updateCategorySkill(index)}
          />
        )}
      </Index>
    </>
  );
};
