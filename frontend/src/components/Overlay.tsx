import clsx from "clsx";
import { Component, ComponentProps, splitProps } from "solid-js";

export type OverlayProps = ComponentProps<"div">;

export const Overlay: Component<OverlayProps> = (props) => {
  const [cls, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={clsx("fixed bottom-0 left-0 right-0 top-0 z-50", cls.class)}
      {...rest}
    />
  );
};
