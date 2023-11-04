import { ButtonColor } from "@charaxiv/components/Button";
import {
  EMOTION_CATEGORY_COLOR,
  EMOTION_CATEGORY_MAP,
  EmotionType,
  MultiSkill,
  SingleSkill,
  Skill,
  Status,
  BaseVariableKey,
} from "./types";

export const emotionColor = (emotion?: EmotionType): ButtonColor =>
  emotion ? EMOTION_CATEGORY_COLOR[EMOTION_CATEGORY_MAP[emotion]] : "default";

export const emotionText = (emotion?: EmotionType): string =>
  !emotion ? "未設定" : `${emotion}（${EMOTION_CATEGORY_MAP[emotion]}）`;

export const maxVariableValue = (
  status: Status,
  keys: BaseVariableKey[],
): number => Math.max(...keys.map((key) => status.variables[key]));

export const maxVariableIndex = (
  status: Status,
  keys: BaseVariableKey[],
): number => {
  const values = keys.map((key) => status.variables[key]);
  return values.indexOf(Math.max(...values));
};

export const maxVariableKey = (
  status: Status,
  keys: BaseVariableKey[],
): BaseVariableKey => keys[maxVariableIndex(status, keys)];

export const isSingleSkill = (skill: Skill): skill is SingleSkill =>
  skill.type === "single";

export const asSingleSkill = (skill: Skill): SingleSkill | undefined =>
  isSingleSkill(skill) ? skill : undefined;

export const isMultiSkill = (skill: Skill): skill is MultiSkill =>
  skill.type === "multi";

export const asMultiSkill = (skill: Skill): MultiSkill | undefined =>
  isMultiSkill(skill) ? skill : undefined;
