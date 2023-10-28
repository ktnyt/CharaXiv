import { Component, Show } from "solid-js";
import { asMultiSkill, asSingleSkill } from "../helpers";
import { Skill, Status } from "../types";
import { Single } from "./Single";
import { Multi } from "./Multi";

export type GenericProps = {
  skill: Skill;
  status: Status;
  atUpdate: (skill: Skill) => void;
};

export const Generic: Component<GenericProps> = (props) => {
  return (
    <>
      <Show when={asSingleSkill(props.skill)}>
        {(skill) => (
          <Single
            skill={skill()}
            status={props.status}
            disabled={false}
            hideInit={false}
            atUpdate={props.atUpdate}
          />
        )}
      </Show>

      <Show when={asMultiSkill(props.skill)}>
        {(skill) => (
          <Multi
            skill={skill()}
            status={props.status}
            disabled={false}
            hideInit={false}
            atUpdate={props.atUpdate}
          />
        )}
      </Show>
    </>
  );
};
