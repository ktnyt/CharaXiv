import { Accessor, createEffect, createSignal } from 'solid-js'

export const createDebounce = <T>(
  source: Accessor<T>,
  wait: number,
): Accessor<T> => {
  const [signal, setSignal] = createSignal(source())
  let timeout = setTimeout(() => {
    const value = source()
    if (value !== signal()) setSignal(() => value)
  }, wait)
  createEffect(() => {
    const value = source()
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      setSignal(() => value)
    }, wait)
  })
  return signal
}
