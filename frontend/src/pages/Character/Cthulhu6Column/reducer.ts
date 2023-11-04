import { CthulhuData, Status } from "./types";

export type CthulhuAction = {
  type: "status";
  value: Status;
};

export const CthulhuReducer =
  (action: CthulhuAction) =>
  (state: CthulhuData): CthulhuData => {
    switch (action.type) {
      case "status":
        return {
          ...state,
          status: action.value,
        };

      default:
        return state;
    }
  };
