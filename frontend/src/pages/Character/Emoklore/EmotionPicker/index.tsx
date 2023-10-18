import { Button, ButtonColor } from "@charaxiv/components/Button";
import { Modal } from "@charaxiv/components/Modal";
import { Component, For, Show, createSignal } from "solid-js";
import {
  EMOTION_KEYS,
  EmotionType,
  Emotions,
  EMOTION_KEY_LABEL,
  EmotionKey,
} from "@charaxiv/pages/Character/Emoklore/types";
import { ModalContent } from "./ModalContent";
import { emotionColor, emotionText } from "../helpers";

export type EmotionPickerProps = {
  emotions: Partial<Emotions>;
  readonly?: boolean;
  atUpdate: (emotions: Partial<Emotions>) => void;
};

export const EmotionPicker: Component<EmotionPickerProps> = (props) => {
  const [emotionKeyGet, emotionKeySet] = createSignal<EmotionKey>();

  const emotionSelectHandle =
    (emotionKey: EmotionKey) => (emotion: EmotionType) => {
      props.atUpdate(
        Object.fromEntries(
          EMOTION_KEYS.map((iterKey) => {
            const propEmotion = props.emotions[iterKey];
            if (propEmotion === emotion) {
              return [iterKey, undefined];
            }
            if (iterKey === emotionKey) {
              return [iterKey, emotion];
            }
            return [iterKey, propEmotion];
          }),
        ),
      );
      emotionKeySet(undefined);
    };

  return (
    <div class="flex w-full flex-col">
      <For each={EMOTION_KEYS}>
        {(emotionKey) => (
          <div class="w-full">
            <Button
              variant={props.emotions[emotionKey] ? "outline" : "default"}
              color={emotionColor(props.emotions[emotionKey])}
              fullWidth
              onClick={() => emotionKeySet(emotionKey)}
            >
              {EMOTION_KEY_LABEL[emotionKey]}：
              {emotionText(props.emotions[emotionKey])}
            </Button>
          </div>
        )}
      </For>

      <Show when={emotionKeyGet()} keyed>
        {(emotionKey) => (
          <Modal atClose={() => emotionKeySet(undefined)}>
            <ModalContent
              emotionKey={emotionKey}
              emotions={props.emotions}
              atSelect={emotionSelectHandle(emotionKey)}
              atClose={() => emotionKeySet(undefined)}
            />
          </Modal>
        )}
      </Show>
    </div>
  );
};
