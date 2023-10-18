import { Character } from "@charaxiv/types/character";
import { EmokloreData, Emotions, Reverb } from "./types";
import { ProfileAction, ProfileReducer } from "../Profile/reducer";

export type EmokloreAction =
  | ProfileAction
  | {
      type: "emotions";
      emotions: Partial<Emotions>;
    }
  | {
      type: "resonance";
      resonance: number;
    }
  | {
      type: "reverbs";
      reverbs: Reverb[];
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
            emotions: action.emotions,
          },
        };

      case "resonance":
        return {
          ...state,
          data: {
            ...state.data,
            resonance: action.resonance,
          },
        };

      case "reverbs":
        return {
          ...state,
          data: {
            ...state.data,
            reverbs: action.reverbs,
          },
        };

      default:
        return ProfileReducer(action)(state);
    }
  };
