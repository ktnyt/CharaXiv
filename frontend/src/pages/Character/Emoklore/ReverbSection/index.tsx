import { Component, For, Index, untrack } from "solid-js";
import { Row } from "./Row";
import { Reverb } from "../types";
import { Button, ButtonProps } from "@charaxiv/components/Button";

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
    <div class="flex flex-col">
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
      <Button variant="outline" color="blue" onClick={reverbAddHandle}>
        残響を追加
      </Button>
    </div>
  );
};
