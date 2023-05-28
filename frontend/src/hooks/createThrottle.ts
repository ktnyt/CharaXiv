import { Accessor, createSignal, onCleanup } from 'solid-js'

export const createThrottle = <T>(
  source: Accessor<T>,
  wait: number,
): Accessor<T> => {
  const [signal, setSignal] = createSignal(source())
  const handle = setInterval(() => setSignal(() => source()), wait)
  onCleanup(() => clearInterval(handle))
  return signal
}
