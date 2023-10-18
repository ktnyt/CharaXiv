import { Component, ComponentProps } from "solid-js";
import { EmotionType } from "../types";
import { emotionColor } from "../helpers";
import { Button } from "@charaxiv/components/Button";
import clsx from "clsx";

export type SelectButtonProps = {
  emotion: EmotionType;
  selected: boolean;
  occupied: boolean;
} & ComponentProps<"button">;

export const SelectButton: Component<SelectButtonProps> = (props) => {
  return (
    <Button
      {...props}
      color={emotionColor(props.emotion)}
      variant={props.selected ? "default" : "outline"}
      class={clsx(
        props.emotion === "自己顕示" && "text-sm",
        !props.selected && props.occupied && "opacity-50",
      )}
    >
      {props.emotion}
    </Button>
  );
};
