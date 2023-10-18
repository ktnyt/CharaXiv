import { Section } from "@charaxiv/components/Section";
import { Component, For, createEffect } from "solid-js";
import { Profile } from "../Profile";
import {
  EMOKLORE_DATA_DEFAULTS,
  EmokloreData,
} from "@charaxiv/pages/Character/Emoklore/types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { EmotionPicker } from "./EmotionPicker";
import { ReverbSection } from "./ReverbSection";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { Character } from "@charaxiv/types/character";
import { EmokloreReducer } from "./reducer";
import { sequence } from "@charaxiv/components/utils";
import { createDebounce } from "@charaxiv/hooks/createDebounce";

export type EmokloreProps = {
  // sheet: Sheet<unknown>;
};

export const Emoklore: Component<EmokloreProps> = (props) => {
  const sheet: Character<EmokloreData> = {
    id: "hoge",
    owner: "nano",
    system: "emoklore",
    name: "",
    ruby: "",
    tags: [],
    images: [],
    public: "",
    secret: "",
    data: EMOKLORE_DATA_DEFAULTS,
  };

  const [state, dispatch] = createReducer(sheet, EmokloreReducer);
  const debounced = createDebounce(state, 1000);

  createEffect(() => {
    console.log(debounced());
  });

  return (
    <div class="mt-4 grid grid-cols-[minmax(320px,_480px)] sm:grid-cols-[minmax(320px,_480px)_minmax(320px,_400px)] sm:gap-x-4">
      <Profile base={state()} dispatch={dispatch} />

      <div>
        <Section class="flex w-full flex-col">
          <div class="flex w-full flex-col">
            <h2>共鳴感情</h2>
            <EmotionPicker
              emotions={state().data.emotions}
              atUpdate={(emotions) => dispatch({ type: "emotions", emotions })}
            />
          </div>

          <div class="flex w-full flex-col">
            <h2>共鳴値</h2>
            <SlideSelector
              index={state().data.resonance}
              atCommit={(resonance) =>
                dispatch({ type: "resonance", resonance })
              }
            >
              <For each={sequence(11)}>{(value) => <div>{value}</div>}</For>
            </SlideSelector>
          </div>

          <div class="flex w-full flex-col">
            <h2>残響</h2>
            <ReverbSection
              reverbs={state().data.reverbs}
              atUpdate={(reverbs) => dispatch({ type: "reverbs", reverbs })}
            />
          </div>

          <div class="flex w-full flex-col">
            <h2>能力値</h2>
          </div>

          <div class="flex w-full flex-col">
            <h2>パラメータ</h2>
          </div>

          <div class="flex w-full flex-col">
            <h2>技能</h2>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Emoklore;
