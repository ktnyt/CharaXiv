import clsx from "clsx";
import {
  children as resolve,
  ComponentProps,
  createSignal,
  Index,
  JSX,
  ParentComponent,
  splitProps,
} from "solid-js";
import { createThrottle } from "../hooks/createThrottle";
import { Drag, getEventCoords } from "./Drag";
import { Ruler } from "./Ruler";
import { notNull, swapElement } from "./utils";

const THRESHOLD = 50;
const signedSqrt = (n: number) => Math.sign(n) * Math.sqrt(Math.abs(n));

type Coord = {
  x: number;
  y: number;
};

const norm = ({ x, y }: Coord) => Math.sqrt(x * x + y * y);

type DragData = {
  index: number;
  origin: Coord;
  offset: Coord;
  stuck: boolean;
};

export type InteractiveFlex = ComponentProps<"div"> & {
  reorder: (indices: number[]) => void;
  fixed?: number[];
  sticky?: boolean;
};

export const InteractiveFlex: ParentComponent<InteractiveFlex> = (props) => {
  const [local, rest] = splitProps(props, [
    "class",
    "children",
    "reorder",
    "fixed",
    "sticky",
  ]);
  const children = resolve(() => local.children);
  const sticky = () => local.sticky ?? false;

  const [dragData, dragDataSet] = createSignal<DragData>();
  const throttledDragData = createThrottle(dragData, 1000 / 60);
  const dragging = (index: number) =>
    ((data) => data && data.index === index)(throttledDragData());

  const dragStyle = (index: number): JSX.CSSProperties | undefined => {
    const data = throttledDragData();
    if (!data || data.index !== index) return undefined;
    const { offset, stuck } = data;
    const x = stuck ? signedSqrt(offset.x) : offset.x;
    const y = stuck ? signedSqrt(offset.y) : offset.y;
    return { transform: `translateX(${x}px) translateY(${y}px)` };
  };

  const [contentRects, setContentRects] = createSignal<
    (DOMRectReadOnly | undefined)[]
  >(Array(children.toArray().length).fill(undefined));

  return (
    <div {...rest} class={clsx("flex flex-row flex-wrap", local.class)}>
      <Index each={children.toArray()}>
        {(child, index) => (
          <Ruler
            update={(entry) => {
              setContentRects((prev) =>
                swapElement(prev, index, entry.target.getBoundingClientRect()),
              );
            }}
          >
            {(ref) => (
              <Drag
                onDragStart={(event) => {
                  const { pageX: x, pageY: y } = getEventCoords(event);
                  const origin = { x, y };
                  const offset = { x: 0, y: 0 };
                  dragDataSet({ index, origin, offset, stuck: sticky() });
                }}
                onDragMove={(event) => {
                  const { pageX, pageY } = getEventCoords(event);
                  dragDataSet(
                    notNull((prev) => {
                      const offset = {
                        x: pageX - prev.origin.x,
                        y: pageY - prev.origin.y,
                      };
                      const stuck = norm(offset) < THRESHOLD && prev.stuck;
                      return { ...prev, offset, stuck };
                    }),
                  );
                }}
                onDragEnd={() => dragDataSet()}
              >
                {(props) => (
                  <div
                    {...props}
                    ref={ref}
                    class={clsx(dragging(index) && "shadow")}
                    style={dragStyle(index)}
                  >
                    {child()}
                  </div>
                )}
              </Drag>
            )}
          </Ruler>
        )}
      </Index>
    </div>
  );
};
