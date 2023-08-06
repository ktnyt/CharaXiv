import { createStore } from "solid-js/store";

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type Dispatcher<Action> = (action: Action) => void;

export const createReducer = <State extends object, Action>(
  init: State,
  reducer: Reducer<State, Action>,
): [State, Dispatcher<Action>] => {
  const [state, setState] = createStore(init);
  const dispatch = (action: Action) => setState(reducer(init, action));
  return [state, dispatch];
};
