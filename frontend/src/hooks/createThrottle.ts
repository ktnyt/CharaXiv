import { Accessor, createSignal, onCleanup } from "solid-js";

export const createThrottle = <T>(
  source: Accessor<T>,
  wait: number,
): Accessor<T> => {
  const [signal, signalSet] = createSignal(source());
  const handle = setInterval(() => signalSet(() => source()), wait);
  onCleanup(() => clearInterval(handle));
  return signal;
};
