import { Section } from "@charaxiv/components/Section";
import { Component } from "solid-js";
import { EmotionPicker } from "./EmotionPicker";
import { EmokloreData } from "./types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { EmokloreReducer } from "./reducer";
import { ReverbSection } from "./ReverbSection";
import { StatusSection } from "./StatusSection";
import { SkillsSection } from "./SkillsSection";
import { H1 } from "@charaxiv/components/Heading";
import { Sequence } from "@charaxiv/components/Sequence";
import { twMerge } from "tailwind-merge";

export type EmokloreColumnProps = {
  init: EmokloreData;
  atUpdate: (data: EmokloreData) => void;
};

export const EmokloreColumn: Component<EmokloreColumnProps> = (props) => {
  const [state, dispatch] = createReducer(props.init, EmokloreReducer, {
    debug: true,
    callback: (data) => props.atUpdate(data),
  });

  return (
    <div
      class={twMerge(
        "grid w-full grid-cols-1 items-start",
        "xl:grid-cols-2 xl:gap-4",
        "2xl:grid-cols-[1fr_2fr]",
      )}
    >
      <Section class="flex w-full flex-col p-2">
        <EmotionPicker
          emotions={state().emotions}
          atUpdate={(value) => dispatch({ type: "emotions", value })}
        />

        <div class="flex w-full flex-col">
          <H1>共鳴値</H1>
          <div class="px-2">
            <SlideSelector
              index={state().resonance}
              atCommit={(value) => dispatch({ type: "resonance", value })}
            >
              <Sequence max={10} />
            </SlideSelector>
          </div>
        </div>

        <ReverbSection
          reverbs={state().reverbs}
          atUpdate={(value) => dispatch({ type: "reverbs", value })}
        />

        <StatusSection
          status={state().status}
          atUpdate={(value) => dispatch({ type: "status", value })}
        />
      </Section>

      <Section class="w-full p-2">
        <SkillsSection
          skills={state().skills}
          status={state().status}
          atUpdate={(value) => dispatch({ type: "skills", value })}
        />
      </Section>
    </div>
  );
};

export default EmokloreColumn;
