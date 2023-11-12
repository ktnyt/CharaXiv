import { Picker } from "@charaxiv/components/Picker";
import { Sequence } from "@charaxiv/components/Sequence";
import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Component } from "solid-js";

export type SkillsSectionProps = {};

export const SkillsSection: Component<SkillsSectionProps> = (props) => {
  return (
    <div>
      <Picker />
    </div>
  );
};
