import { Character } from "@charaxiv/types/character";
import { EmokloreData, Emotions, Reverb, Variables } from "./types";
import { ProfileAction, ProfileReducer } from "../Profile/reducer";

export type EmokloreAction =
  | ProfileAction
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
    };

export const EmokloreReducer =
  (action: EmokloreAction) =>
  (state: Character<EmokloreData>): Character<EmokloreData> => {
    switch (action.type) {
      case "emotions":
        return {
          ...state,
          data: {
            ...state.data,
            emotions: action.value,
          },
        };

      case "resonance":
        return {
          ...state,
          data: {
            ...state.data,
            resonance: action.value,
          },
        };

      case "reverbs":
        return {
          ...state,
          data: {
            ...state.data,
            reverbs: action.value,
          },
        };

      case "variables":
        return {
          ...state,
          data: {
            ...state.data,
            status: {
              ...state.data.status,
              variables: action.value,
            },
          },
        };

      default:
        return ProfileReducer(action)(state);
    }
  };
