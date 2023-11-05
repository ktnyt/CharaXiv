import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { createDebounce } from "./createDebounce";

export const createThrottle = <T>(
  source: Accessor<T>,
  wait: number,
): Accessor<T> => {
  const [signal, signalSet] = createSignal(source());
  const debounced = createDebounce(signal, wait * 2);
  createEffect(() => signalSet(() => debounced()));
  const handle = setInterval(() => signalSet(() => source()), wait);
  onCleanup(() => clearInterval(handle));
  return signal;
};
