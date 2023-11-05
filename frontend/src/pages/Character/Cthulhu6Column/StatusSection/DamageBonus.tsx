import { SlideSelector } from "@charaxiv/components/SlideSelector";
import { Component, Index } from "solid-js";
import { Variables, computeVariable } from "../types";
import { sequence } from "@charaxiv/components/utils";

export type DamageBonusProps = {
  variables: Variables;
};

const FIXED_DAMANGE_BONUS = ["-1d6", "-1d4", "±0", "+1d4", "+1d6"];

export const DamageBonus: Component<DamageBonusProps> = (props) => {
  const index = () => {
    const total =
      computeVariable(props.variables.STR) +
      computeVariable(props.variables.SIZ);
    if (total < 13) return 0;
    if (total < 17) return 1;
    if (total < 25) return 2;
    if (total < 33) return 3;
    if (total < 41) return 4;
    return Math.ceil((total - 40) / 16) + 4;
  };

  const values = () => [
    ...FIXED_DAMANGE_BONUS,
    ...(index() > 4 ? [`${index() - 4}d6`] : []),
  ];

  return (
    <>
      <span class="text-center font-semibold">ﾀﾞﾒｰｼﾞﾎﾞｰﾅｽ</span>

      <SlideSelector index={index()} readonly vertical>
        <Index each={values()}>
          {(value) => (
            <div class="flex items-center justify-center font-semibold tabular-nums">
              <span>{value()}</span>
            </div>
          )}
        </Index>
      </SlideSelector>
    </>
  );
};
