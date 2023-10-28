import { Component, For } from "solid-js";
import { EMOTION_TYPES, EmotionKey, EmotionType, Emotions } from "../types";
import { Button } from "@charaxiv/components/Button";
import { SelectButton } from "./SelectButton";

export type ModalContentProps = {
  emotionKey: EmotionKey;
  emotions: Partial<Emotions>;
  atSelect: (emotion: EmotionType) => void;
  atClose: () => void;
};

export const ModalContent: Component<ModalContentProps> = (props) => {
  const selected = (emotion: EmotionType) =>
    props.emotions[props.emotionKey] === emotion;
  const occupied = (emotion: EmotionType) =>
    Object.values(props.emotions).includes(emotion);
  return (
    <div class="w-300 box-border flex flex-col gap-2 rounded bg-nord-0 p-2">
      <div class="grid grid-cols-4 gap-1">
        <For each={EMOTION_TYPES}>
          {(emotion) => (
            <SelectButton
              emotion={emotion}
              selected={selected(emotion)}
              occupied={occupied(emotion)}
              onClick={(event) => {
                event.preventDefault();
                props.atSelect(emotion);
              }}
            />
          )}
        </For>
      </div>
      <Button
        color="default"
        variant="default"
        onClick={(event) => {
          event.preventDefault();
          props.atClose();
        }}
      >
        閉じる
      </Button>
    </div>
  );
};
