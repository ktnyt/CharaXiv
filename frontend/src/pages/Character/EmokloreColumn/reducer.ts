import { Character } from "@charaxiv/types/character";
import { EmokloreData, Emotions, Reverb, Skills, Variables } from "./types";
import { ProfileAction, ProfileReducer } from "../ProfileColumn/reducer";

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
      type: "variables";
      value: Variables;
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

      case "variables":
        return {
          ...state,
          status: {
            ...state.status,
            variables: action.value,
          },
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
