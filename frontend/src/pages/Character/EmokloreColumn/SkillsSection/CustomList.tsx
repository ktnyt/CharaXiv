import { H2 } from "@charaxiv/components/Heading";
import { Component, Index } from "solid-js";
import { CustomSkill, Status } from "../types";
import { Custom } from "./Custom";
import { replace } from "@charaxiv/components/utils";
import { Button } from "@charaxiv/components/Button";

export type CustomListProps = {
  skills: CustomSkill[];
  status: Status;
  atUpdate: (skills: CustomSkill[]) => void;
};

export const CustomList: Component<CustomListProps> = (props) => {
  const updateCustom = (index: number) => (skill: CustomSkill) =>
    props.atUpdate(replace(props.skills, index, skill));

  const addCustom = () =>
    props.atUpdate([
      ...props.skills,
      { name: "", exskill: false, level: 0, base: "身体" },
    ]);

  const deleteCustom = (index: number) => () =>
    props.atUpdate(props.skills.filter((_, i) => i !== index));

  return (
    <div class="flex flex-col gap-2 px-2">
      <H2>独自技能</H2>

      <div class="flex flex-col gap-2 px-2">
        <Index each={props.skills}>
          {(skill, index) => (
            <Custom
              skill={skill()}
              status={props.status}
              disabled={false}
              hideInit={false}
              atUpdate={updateCustom(index)}
              atDelete={deleteCustom(index)}
            />
          )}
        </Index>

        <div class="w-full px-2 pb-2">
          <Button variant="outline" color="blue" fullWidth onClick={addCustom}>
            独自技能を追加
          </Button>
        </div>
      </div>
    </div>
  );
};
