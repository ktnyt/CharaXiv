import { Component, For, Index, untrack } from "solid-js";
import { Row } from "./Row";
import { Reverb } from "../types";
import { Button, ButtonProps } from "@charaxiv/components/Button";
import { H1 } from "@charaxiv/components/Heading";

export type ReverbSectionProps = {
  reverbs: Reverb[];
  atUpdate: (reverbs: Reverb[]) => void;
};

export const ReverbSection: Component<ReverbSectionProps> = (props) => {
  const reverbUpdateHandle = (index: number) => (reverb: Reverb) => {
    props.atUpdate([
      ...props.reverbs.slice(0, index),
      reverb,
      ...props.reverbs.slice(index + 1),
    ]);
  };

  const reverbDeleteHandle = (index: number) => () => {
    props.atUpdate([
      ...props.reverbs.slice(0, index),
      ...props.reverbs.slice(index + 1),
    ]);
  };

  const reverbAddHandle: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    props.atUpdate([
      ...props.reverbs,
      {
        scenario: "",
        emotion: "",
        consumed: false,
      },
    ]);
  };

  return (
    <div class="flex flex-col gap-2">
      <H1>残響</H1>

      <div class="flex flex-col gap-2">
        <Index each={props.reverbs}>
          {(reverb, index) => (
            <Row
              scenario={untrack(() => reverb().scenario)}
              emotion={untrack(() => reverb().emotion)}
              consumed={reverb().consumed}
              atUpdate={reverbUpdateHandle(index)}
              atDelete={reverbDeleteHandle(index)}
            />
          )}
        </Index>
      </div>

      <div class="w-full px-6 pb-2">
        <Button
          variant="outline"
          color="blue"
          fullWidth
          onClick={reverbAddHandle}
        >
          残響を追加
        </Button>
      </div>
    </div>
  );
};
