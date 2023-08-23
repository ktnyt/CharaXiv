import { Button } from "@charaxiv/components/Button";
import { Component } from "solid-js";

export type EmotionPickerProps = {
  readonly?: boolean;
};

export const EmotionPicker: Component<EmotionPickerProps> = (props) => {
  return (
    <div class="w-full">
      <Button variant="default" color="default" fullWidth>
        未設定
      </Button>
    </div>
  );
};
