import clsx from "clsx";
import { ParentComponent } from "solid-js";
import { Button, ButtonProps } from "./Button";

export type IconButtonProps = ButtonProps & {
  shadow?: boolean;
  size?: number;
};

export const IconButton: ParentComponent<IconButtonProps> = (props) => (
  <Button {...props} class={clsx("w-8 overflow-hidden", props.class)}>
    {props.children}
  </Button>
);
