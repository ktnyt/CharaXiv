import { Component, createSignal } from "solid-js";
import { Section } from "@charaxiv/components/Section";

export type Cthulhu6Props = {
  // sheet: Sheet<Cthulhu6Data>;
};

export const Cthulhu6: Component<Cthulhu6Props> = () => {
  return (
    <>
      <Section class="flex h-10 w-full flex-col"></Section>
      <Section class="flex h-10 w-full flex-col"></Section>
    </>
  );
};

export default Cthulhu6;
