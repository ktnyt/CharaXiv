import { Component, Index } from "solid-js";
import { Skill, SkillGroup, Status } from "../types";
import { Base } from "./Base";
import { Generic } from "./Generic";
import { replace } from "@charaxiv/components/utils";

export type GroupProps = {
  group: SkillGroup;
  status: Status;
  atUpdate: (group: SkillGroup) => void;
};

export const Group: Component<GroupProps> = (props) => {
  const updateSkill = (index: number) => (skill: Skill) =>
    props.atUpdate({
      ...props.group,
      skills: replace(props.group.skills, index, skill),
    });

  return (
    <div class="px-2">
      <Base
        name={props.group.name}
        base={props.group.base}
        status={props.status}
      />

      <Index each={props.group.skills}>
        {(skill, index) => (
          <Generic
            skill={skill()}
            status={props.status}
            atUpdate={updateSkill(index)}
          />
        )}
      </Index>
    </div>
  );
};
