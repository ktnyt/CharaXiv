import { Component, For } from "solid-js";
import { SkillGenre, Status, VariableKey } from "../types";
import { Input } from "@charaxiv/components/Input";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { sequence } from "@charaxiv/components/utils";
import { Button } from "@charaxiv/components/Button";
import { Icon, SolidTrashAlt } from "@charaxiv/components/Icon";

export type GenreProps = {
  name: string;
  genre: SkillGenre;
  base: VariableKey;
  status: Status;
  atUpdate: (genre: SkillGenre) => void;
  atDelete: () => void;
};

export const Genre: Component<GenreProps> = (props) => {
  const updateLabel = (label: string) =>
    props.atUpdate({ label, level: props.genre.level });

  const updateLevel = (level: number) =>
    props.atUpdate({ label: props.genre.label, level });

  return (
    <div class="grid grid-cols-[100px_1fr_32px_32px]">
      <div>
        <Input
          placeholder={props.name}
          borderless
          onInput={(event) => updateLabel(event.currentTarget.value)}
        />
      </div>

      <SlideSelector index={props.genre.level} atCommit={updateLevel}>
        <For each={sequence(0, 4)}>{(value) => <div>{value}</div>}</For>
      </SlideSelector>

      <SlideSelector
        index={props.status.variables[props.base] + props.genre.level}
      >
        <For each={sequence(0, 10)}>{(value) => <span>{value}</span>}</For>
      </SlideSelector>

      <div>
        <Button variant="textual" color="red" onClick={props.atDelete}>
          <Icon of={SolidTrashAlt} />
        </Button>
      </div>
    </div>
  );
};
