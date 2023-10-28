import { Component, Index } from "solid-js";
import { SkillCategory, SkillGroup, Status } from "../types";
import { Group } from "./Group";
import { replace } from "@charaxiv/components/utils";
import { H2 } from "@charaxiv/components/Heading";

export type CategoryProps = {
  category: SkillCategory;
  status: Status;
  atUpdate: (category: SkillCategory) => void;
};

export const Category: Component<CategoryProps> = (props) => {
  const updateGroup = (index: number) => (group: SkillGroup) =>
    props.atUpdate({
      ...props.category,
      groups: replace(props.category.groups, index, group),
    });

  return (
    <div class="px-2">
      <H2>{props.category.name}</H2>

      <div class="flex flex-col">
        <Index each={props.category.groups}>
          {(group, index) => (
            <Group
              group={group()}
              status={props.status}
              atUpdate={updateGroup(index)}
            />
          )}
        </Index>
      </div>
    </div>
  );
};
