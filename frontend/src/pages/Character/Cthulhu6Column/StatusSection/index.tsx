import { Component, Show, createSignal, untrack } from "solid-js";
import { Parameters, Status, VARIABLE_KEYS, Variables } from "../types";
import { H1, H2 } from "@charaxiv/components/Heading";
import { Button } from "@charaxiv/components/Button";
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

  const updateParameters = (parameters: Parameters) => {};

  const [randomModalGet, randomModalSet] = createSignal(false);

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-row justify-between">
        <div>
          <H1>能力値</H1>
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
              <Button variant="default" color="blue" onClick={() => {}}>
                全ステータス
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
        parameters={props.status.parameters}
        variables={props.status.variables}
        atUpdate={updateParameters}
      />
    </div>
  );
};
