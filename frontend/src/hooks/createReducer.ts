import { Accessor, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type Reducer<State, Action> = (
  action: Action,
) => (state: State) => State;

export type Dispatcher<Action> = (action: Action) => void;

export const createReducer = <State extends object, Action>(
  init: State,
  reducer: Reducer<State, Action>,
): [Accessor<State>, Dispatcher<Action>] => {
  const [getter, setter] = createSignal(init);
  const dispatch = (action: Action) => setter(reducer(action));
  return [getter, dispatch];
};
