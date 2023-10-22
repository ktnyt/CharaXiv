import {
  Component,
  Index,
  JSX,
  children,
  createEffect,
  createSignal,
} from "solid-js";

import { Drag, EventCoords } from "./Drag";
import { Tap } from "./Tap";
import { clamp, defined } from "./utils";
import { Viewport } from "@charaxiv/context/viewport";
import clsx from "clsx";

export type SlideSelectorProps = {
  index?: number;
  atCommit?: (index: number) => void;
  readonly?: boolean;
  children: JSX.Element;
};

export const SlideSelector: Component<SlideSelectorProps> = (props) => {
  const resolved = children(() => props.children);
  const childElements = resolved.toArray();

  let current = props.index ?? 0;
  const [offsetGet, offsetSet] = createSignal(current * 32);
  let origin: number | undefined;

  const computeTranslate = (offset: number) => {
    if (offset < 0) return Math.sqrt(Math.abs(offset));
    const max = (childElements.length - 1) * 32;
    if (offset > max) return -(max + Math.sqrt(offset - max));
    return -offset;
  };

  const sliderItemStyle = (index: number): JSX.CSSProperties => {
    const offset = offsetGet();
    return {
      transform: `translateX(${computeTranslate(offset)}px)`,
      transition: origin === undefined ? "transform 0.3s" : "",
      opacity: Math.floor((offset + 16) / 32) === index ? "100%" : "33%",
    };
  };

  createEffect(() => offsetSet(() => (props.index ?? 0) * 32));

  const [changingGet, changingSet] = createSignal(false);

  createEffect(() => Viewport.scroll(!changingGet()));

  const dragStartHandle = ({ pageX: coord }: EventCoords) => {
    origin = coord;
  };

  const dragMoveHandle = ({ pageX: coord }: EventCoords) => {
    if (origin) {
      const delta = origin - coord;
      origin = coord;
      offsetSet((offset) => {
        const index = Math.floor((offset + 16) / 32);
        changingSet((dragging) => index !== current || dragging);
        return offset + delta;
      });
    }
  };

  const dragEndHandle = () => {
    origin = undefined;
    offsetSet((offset) => {
      const index = Math.floor((offset + 16) / 32);
      current = index;
      if (props.atCommit) props.atCommit(index);
      return clamp(index, 0, childElements.length) * 32;
    });
    changingSet(false);
  };

  const tapHandle = (index: number) => {
    origin = undefined;
    offsetSet((offset) => {
      if (index * 32 !== offset && props.atCommit) props.atCommit(index);
      current = index;
      return index * 32;
    });
  };

  return (
    <Drag
      atStart={dragStartHandle}
      atMove={dragMoveHandle}
      atEnd={dragEndHandle}
      disabled={props.readonly}
    >
      {(dragProps) => (
        <div
          class="flex h-8 w-full select-none justify-center overflow-clip"
          {...dragProps}
        >
          <div class="flex h-8 w-8">
            <div class="flex flex-row">
              <Index each={childElements}>
                {(getChild, index) => (
                  <Tap onTap={() => tapHandle(index)} disabled={props.readonly}>
                    {(tapProps) => (
                      <div
                        class={clsx(
                          "flex h-8 w-8 justify-center align-middle leading-8",
                          props.readonly ?? false
                            ? "cursor-default"
                            : "cursor-pointer",
                        )}
                        style={sliderItemStyle(index)}
                        {...tapProps}
                      >
                        {getChild()}
                      </div>
                    )}
                  </Tap>
                )}
              </Index>
            </div>
          </div>
        </div>
      )}
    </Drag>
  );
};
