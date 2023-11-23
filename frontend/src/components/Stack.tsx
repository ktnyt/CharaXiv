import clsx from "clsx";
import { Component, ComponentProps, splitProps } from "solid-js";

export type StackProps = ComponentProps<"div">;

export const Stack: Component<StackProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div
      {...rest}
      class={clsx(
        "grid h-full w-full grid-cols-1 grid-rows-1 overflow-clip [&>*]:col-[1_/_1] [&>*]:row-[1_/_1]",
        local.class,
      )}
    >
      {local.children}
    </div>
  );
};
