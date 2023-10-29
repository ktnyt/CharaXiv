import { Character } from "@charaxiv/types/character";
import { EmokloreData, Emotions, Reverb, Skills, Status } from "./types";

export type EmokloreAction =
  | {
      type: "emotions";
      value: Partial<Emotions>;
    }
  | {
      type: "resonance";
      value: number;
    }
  | {
      type: "reverbs";
      value: Reverb[];
    }
  | {
      type: "status";
      value: Status;
    }
  | {
      type: "skills";
      value: Skills;
    };

export const EmokloreReducer =
  (action: EmokloreAction) =>
  (state: EmokloreData): EmokloreData => {
    switch (action.type) {
      case "emotions":
        return {
          ...state,
          emotions: action.value,
        };

      case "resonance":
        return {
          ...state,
          resonance: action.value,
        };

      case "reverbs":
        return {
          ...state,
          reverbs: action.value,
        };

      case "status":
        return {
          ...state,
          status: action.value,
        };

      case "skills":
        return {
          ...state,
          skills: action.value,
        };

      default:
        return state;
    }
  };
