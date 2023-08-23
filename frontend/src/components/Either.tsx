import { FlowComponent, JSX, Show } from "solid-js";

export const Either: FlowComponent<
  { when: boolean },
  [JSX.Element, JSX.Element]
> = (props) => {
  return (
    <Show when={props.when} fallback={props.children[1]}>
      {props.children[0]}
    </Show>
  );
};
