import { Accessor, createEffect, createSignal } from "solid-js";

export const createDebounce = <T>(
  source: Accessor<T>,
  wait: number,
): Accessor<T> => {
  const [signal, signalSet] = createSignal(source());
  let timeout = setTimeout(() => {
    const value = source();
    if (value !== signal()) signalSet(() => value);
  }, wait);
  createEffect(() => {
    const value = source();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      signalSet(() => value);
    }, wait);
  });
  return signal;
};
