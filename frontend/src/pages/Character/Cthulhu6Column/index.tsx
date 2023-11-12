import { Component, createSignal } from "solid-js";
import { Section } from "@charaxiv/components/Section";
import { StatusSection } from "./StatusSection";
import { CthulhuData } from "./types";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { CthulhuReducer } from "./reducer";
import { SkillsSection } from "./SkillsSection";

export type Cthulhu6Props = {
  init: CthulhuData;
  atUpdate: (data: CthulhuData) => void;
};

export const Cthulhu6: Component<Cthulhu6Props> = (props) => {
  const [state, dispatch] = createReducer(props.init, CthulhuReducer, {
    debug: true,
    callback: (data) => props.atUpdate(data),
  });

  return (
    <>
      <Section class="flex w-full flex-col gap-4 p-2">
        <StatusSection
          status={state().status}
          atUpdate={(value) => dispatch({ type: "status", value })}
        />
      </Section>

      <Section class="flex w-full flex-col">
        <SkillsSection />
      </Section>
    </>
  );
};

export default Cthulhu6;
