import { ButtonColor } from "@charaxiv/components/Button";
import {
  EMOTION_CATEGORY_COLOR,
  EMOTION_CATEGORY_MAP,
  EmotionType,
} from "./types";

export const emotionColor = (emotion?: EmotionType): ButtonColor =>
  emotion ? EMOTION_CATEGORY_COLOR[EMOTION_CATEGORY_MAP[emotion]] : "default";

export const emotionText = (emotion?: EmotionType): string =>
  !emotion ? "未設定" : `${emotion}（${EMOTION_CATEGORY_MAP[emotion]}）`;
