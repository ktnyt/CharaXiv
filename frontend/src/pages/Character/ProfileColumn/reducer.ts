import { Profile } from "@charaxiv/types/character";

export type ProfileAction =
  | {
      type: "name";
      value: string;
    }
  | {
      type: "ruby";
      value: string;
    }
  | {
      type: "tags";
      value: string[];
    }
  | {
      type: "images";
      value: string[];
    }
  | {
      type: "public";
      value: string;
    }
  | {
      type: "secret";
      value: string;
    };

export const ProfileReducer =
  ({ type: actionType, value }: ProfileAction) =>
  (state: Profile): Profile => {
    switch (actionType) {
      case "name":
        return { ...state, name: value };

      case "ruby":
        return { ...state, ruby: value };

      case "tags":
        return { ...state, tags: value };

      case "images":
        return { ...state, images: value };

      case "public":
        return { ...state, public: value };

      case "secret":
        return { ...state, secret: value };

      default:
        return state;
    }
  };
