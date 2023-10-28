import { Accessor, JSX } from "solid-js";

export const delegateJSXEvent =
  <T extends HTMLElement, E extends Event>(
    accessor: Accessor<JSX.EventHandlerUnion<T, E> | undefined>,
  ): JSX.EventHandler<T, E> =>
  (event) => {
    const handler = accessor();
    if (handler) {
      if (typeof handler === "function") {
        handler(event);
      } else {
        handler[0](handler[1], event);
      }
    }
  };

export type EventHandler<E extends Event> = (ev: E) => void;

export const delegateEvent =
  <E extends Event>(
    accessor: Accessor<EventHandler<E> | undefined>,
  ): EventHandler<E> =>
  (event) => {
    const handler = accessor();
    if (handler) handler(event);
  };

type Nullable<T> = T | null | undefined;

export function defined<T, U>(
  callback: (value: NonNullable<T>) => Nullable<U>,
): (value: T) => Nullable<U>;
export function defined<T, U>(
  callback: (value: NonNullable<T>) => Nullable<U>,
  value: T,
): U;
export function defined<T, U>(
  callback: (value: NonNullable<T>) => Nullable<U>,
  value?: T,
): ((value: T) => Nullable<U>) | Nullable<U> {
  if (value) return defined(callback)(value);

  return (value: T) => {
    if (value === null) return null;
    if (value === undefined) return undefined;
    return callback(value);
  };
}

export const swapElement = <T>(array: T[], index: number, value: T) => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1),
];

export const sequence = (min: number, max?: number): number[] =>
  max === undefined
    ? sequence(0, min)
    : [...new Array(max - min)].map((_, index) => index + min);

export const inspect = <T>(value: T): T => {
  console.log(value);
  return value;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max));

export const pick =
  (cond: boolean) =>
  <T>(t: T, f: T): T =>
    cond ? t : f;

export const transform = <T>(
  array: Array<T>,
  at: number,
  f: (value: T) => T,
): Array<T> => array.map((value, index) => (at === index ? f(value) : value));

export const replace = <T>(array: Array<T>, at: number, by: T): Array<T> =>
  array.map((value, index) => (at === index ? by : value));
