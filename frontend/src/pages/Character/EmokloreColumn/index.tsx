import { Section } from "@charaxiv/components/Section";
import { Component, For } from "solid-js";
import { EmotionPicker } from "./EmotionPicker";
import { EmokloreData } from "./types";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { EmokloreReducer } from "./reducer";
import { ReverbSection } from "./ReverbSection";
import { VariablesSection } from "./VariablesSection";
import { SkillsSection } from "./SkillsSection";
import { H1 } from "@charaxiv/components/Heading";
import { Sequence } from "@charaxiv/components/Sequence";

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
    <Section class="flex w-full flex-col gap-4 p-2">
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

      <VariablesSection
        variables={state().status.variables}
        atUpdate={(value) => dispatch({ type: "variables", value })}
      />

      <SkillsSection
        skills={state().skills}
        status={state().status}
        atUpdate={(value) => dispatch({ type: "skills", value })}
      />
    </Section>
  );
};

export default EmokloreColumn;
