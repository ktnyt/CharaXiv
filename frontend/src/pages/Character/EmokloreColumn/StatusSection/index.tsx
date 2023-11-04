import { Component, Show, createSignal, untrack } from "solid-js";
import { Mutables, Status, VARIABLE_KEYS, Variables } from "../types";
import { H1, H2 } from "@charaxiv/components/Heading";
import clsx from "clsx";
import { Input } from "@charaxiv/components/Input";
import { Button } from "@charaxiv/components/Button";
import { randomElement } from "@charaxiv/components/utils";
import { Modal } from "@charaxiv/components/Modal";
import { VariableList } from "./VariableList";
import { ParameterList } from "./ParameterList";

export type StatusSectionType = {
  status: Status;
  atUpdate: (status: Status) => void;
};

export const StatusSection: Component<StatusSectionType> = (props) => {
  const updateVariables = (variables: Variables) =>
    props.atUpdate({ ...props.status, variables });

  const updateParameters = (parameters: Partial<Mutables>) =>
    props.atUpdate({ ...props.status, mutables: parameters });

  const consumed = () =>
    VARIABLE_KEYS.filter((key) => key !== "運勢")
      .map((key) => props.status.variables[key])
      .reduce((a, b) => a + b, 0);

  const points = () => 25 + props.status.extra;

  const updateExtra = (value: string) => {
    const extra = Number(value);
    if (isNaN(extra)) return;
    props.atUpdate({ ...props.status, extra });
  };

  const increment = (variables: Variables): Variables => {
    const consumed = VARIABLE_KEYS.filter((key) => key !== "運勢")
      .map((key) => variables[key])
      .reduce((a, b) => a + b, 0);
    if (consumed < 25) {
      const key = randomElement(
        VARIABLE_KEYS.filter((key) => key !== "運勢" && variables[key] < 6),
      );
      return increment({ ...variables, [key]: variables[key] + 1 });
    }
    return variables;
  };

  const [randomModalGet, randomModalSet] = createSignal(false);

  const randomizeAll = () =>
    props.atUpdate({
      ...props.status,
      variables: increment({
        身体: 1,
        器用: 1,
        精神: 1,
        五感: 1,
        知力: 1,
        魅力: 1,
        社会: 1,
        運勢: Math.floor(Math.random() * 6) + 1,
      }),
    });

  const randomizeLuck = () =>
    props.atUpdate({
      ...props.status,
      variables: {
        ...props.status.variables,
        運勢: Math.floor(Math.random() * 6) + 1,
      },
    });

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row items-baseline gap-2">
          <H1>能力値</H1>

          <span
            class={clsx(
              "text-lg proportional-nums",
              consumed() > points() && "text-red-500",
              consumed() < points() && "text-yellow-500",
            )}
          >
            <span class="justify-self-end pr-2">{consumed()} / 25</span>
            <span class="text-center">+</span>
            <Input
              value={untrack(() =>
                props.status.extra === 0 ? "" : `${props.status.extra}`,
              )}
              class="w-12 text-lg placeholder:text-lg"
              placeholder="0"
              borderless
              onInput={(event) => updateExtra(event.currentTarget.value)}
            />
          </span>
        </div>

        <Button
          variant="outline"
          color="blue"
          onClick={() => randomModalSet(true)}
        >
          ランダム
        </Button>

        <Show when={randomModalGet()}>
          <Modal atClose={() => randomModalSet(false)}>
            <div class="flex w-72 flex-col gap-2 rounded bg-nord-0 p-2 shadow">
              <H2>ランダムに決定</H2>
              <Button
                variant="default"
                color="blue"
                onClick={() => {
                  randomizeAll();
                  randomModalSet(false);
                }}
              >
                全ステータス
              </Button>
              <Button
                variant="outline"
                color="blue"
                onClick={() => {
                  randomizeLuck();
                  randomModalSet(false);
                }}
              >
                運勢のみ
              </Button>
            </div>
          </Modal>
        </Show>
      </div>

      <VariableList
        variables={props.status.variables}
        atUpdate={updateVariables}
      />

      <ParameterList
        parameters={props.status.mutables}
        variables={props.status.variables}
        atUpdate={updateParameters}
      />
    </div>
  );
};
