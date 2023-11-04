import { Section } from "@charaxiv/components/Section";
import { Component } from "solid-js";
import { EmotionPicker } from "./EmotionPicker";
import { EmokloreData } from "./types";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { EmokloreReducer } from "./reducer";
import { ReverbSection } from "./ReverbSection";
import { StatusSection } from "./StatusSection";
import { SkillsSection } from "./SkillsSection";

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
    <>
      <Section class="flex w-full flex-col gap-4 p-2">
        <EmotionPicker
          emotions={state().emotions}
          atUpdate={(value) => dispatch({ type: "emotions", value })}
        />

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
    </>
  );
};

export default EmokloreColumn;
