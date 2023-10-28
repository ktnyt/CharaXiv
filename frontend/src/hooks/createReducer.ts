import deepEqual from "fast-deep-equal";
import { Accessor, createSignal } from "solid-js";

export type Reducer<State, Action> = (
  action: Action,
) => (state: State) => State;

export type Dispatcher<Action> = (action: Action) => void;

export type ReducerOptions<State> = Partial<{
  debug: boolean;
  callback: (value: State) => void;
}>;

export const createReducer = <State extends object, Action>(
  init: State,
  reducer: Reducer<State, Action>,
  options: ReducerOptions<State> = {},
): [Accessor<State>, Dispatcher<Action>] => {
  const [getter, setter] = createSignal(init);
  const debug = options.debug ?? false;
  const callback = options.callback ?? (() => {});
  const dispatch = (action: Action) =>
    setter((prev) => {
      const transform = reducer(action);
      const next = transform(prev);
      if (deepEqual(prev, next)) return prev;
      if (debug) console.info(structuredClone({ action, prev, next }));
      callback(next);
      return next;
    });
  return [getter, dispatch];
};
