import { Component, Index, Show, createEffect, createSignal } from "solid-js";
import { Drag, EventCoords } from "../Drag";
import { Tag } from "./Tag";
import { Viewport } from "@charaxiv/context/Viewport";
import { reinsert } from "./helpers";
import { defined } from "../utils";
import { Overlay } from "../Overlay";
import { Ghost } from "./Ghost";

export type TagListProps = {
  tags: string[];
  atUpdate: (tags: string[]) => void;
  readonly?: boolean;
};

type State = {
  index: number;
  cursor: { x: number; y: number };
};

export const TagList: Component<TagListProps> = (props) => {
  const [stateGet, stateSet] = createSignal<State>();

  const dragStartHandle =
    (index: number) =>
    ({ clientX: x, clientY: y }: EventCoords) => {
      Viewport.scroll(false);
      stateSet((state) => state ?? { index, cursor: { x, y } });
    };

  const dragMoveHandle = ({ clientX: x, clientY: y }: EventCoords) =>
    stateSet((state) => (state ? { ...state, cursor: { x, y } } : undefined));

  const dragEndHandle = () => {
    Viewport.scroll(true);
    stateSet(undefined);
  };

  const tagStyle = (index: number) => {
    const state = stateGet();
    return state
      ? {
          opacity: state.index === index ? "33%" : undefined,
        }
      : undefined;
  };

  const pointerOverHandle = (index: number) => () => {
    stateSet((state) => {
      if (!state) return undefined;
      if (state.index !== index) {
        props.atUpdate(reinsert(props.tags, state.index, index));
      }
      return { ...state, index };
    });
  };

  const deleteHandle = (index: number) => () =>
    props.atUpdate(props.tags.filter((_, i) => i != index));

  return (
    <>
      <Index each={props.tags}>
        {(item, index) => (
          <Drag
            atStart={dragStartHandle(index)}
            atMove={dragMoveHandle}
            atEnd={dragEndHandle}
            disabled={props.readonly}
          >
            {(dragProps) => (
              <div
                style={tagStyle(index)}
                onPointerOver={pointerOverHandle(index)}
                onDragOver={pointerOverHandle(index)}
              >
                <Tag
                  selected={false}
                  readonly={false}
                  atDelete={deleteHandle(index)}
                  {...dragProps}
                >
                  {item()}
                </Tag>
              </div>
            )}
          </Drag>
        )}
      </Index>
      <Show when={stateGet()} keyed>
        {({ index, cursor }) => (
          <Ghost tag={props.tags[index]} cursor={cursor} />
        )}
      </Show>
    </>
  );
};
