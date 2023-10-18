import { Component } from "solid-js";
import { Overlay } from "../Overlay";
import { Tag } from "./Tag";

export type GhostProps = {
  tag: string;
  cursor: { x: number; y: number };
};

export const Ghost: Component<GhostProps> = (props) => {
  let ref!: HTMLDivElement;
  const transform = () => {
    const rect = ref.getBoundingClientRect();
    const x = props.cursor.x - rect.width / 2;
    const y = props.cursor.y - rect.height / 2;
    return `translate(${x}px, ${y}px)`;
  };
  return (
    <Overlay
      class="pointer-events-none cursor-grabbing"
      style={{ transform: transform() }}
    >
      <div ref={ref} class="flex">
        <div class="-translate-x-1/2 -translate-y-1/2">
          <Tag>{props.tag}</Tag>
        </div>
      </div>
    </Overlay>
  );
};
