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

export type SlideSelectorProps = {
  index?: number;
  atCommit: (index: number) => void;
  children: JSX.Element;
};

export const SlideSelector: Component<SlideSelectorProps> = (props) => {
  const resolved = children(() => props.children);
  const childElements = resolved.toArray();

  let current = props.index ?? 0;
  const [offsetGet, offsetSet] = createSignal(current * 32);
  let origin: number | undefined;
  let smooth = true;
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
    smooth = true;
    offsetSet((offset) => {
      const index = Math.floor((offset + 16) / 32);
      current = index;
      props.atCommit(index);
      return clamp(index, 0, childElements.length) * 32;
    });
    changingSet(false);
  };

  const computeTranslate = (offset: number) => {
    if (offset < 0) return Math.sqrt(Math.abs(offset));
    const max = (childElements.length - 1) * 32;
    if (offset > max) return -(max + Math.sqrt(offset - max));
    return -offset;
  };

  const tapHandle = (index: number) => {
    origin = undefined;
    offsetSet((offset) => {
      if (index * 32 !== offset) props.atCommit(index);
      current = index;
      return index * 32;
    });
  };

  const sliderItemStyle = (index: number): JSX.CSSProperties => {
    const offset = offsetGet();
    return {
      transform: `translateX(${computeTranslate(offset)}px)`,
      transition: origin === undefined ? "transform 0.3s" : "",
      opacity: Math.floor((offset + 16) / 32) === index ? "100%" : "33%",
    };
  };

  return (
    <Drag
      atStart={dragStartHandle}
      atMove={dragMoveHandle}
      atEnd={dragEndHandle}
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
                  <Tap onTap={() => tapHandle(index)}>
                    {(tapProps) => (
                      <div
                        class="flex h-8 w-8 cursor-pointer justify-center align-middle leading-8"
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
