import { createEffect, createSignal, Signal } from 'solid-js'

export const createLocalStorage = <T>(key: string, init: T): Signal<T> => {
  const stored = localStorage.getItem(key)
  const [value, setValue] = createSignal(
    stored === null ? init : (JSON.parse(stored) as T),
  )
  createEffect(() => localStorage.setItem(key, JSON.stringify(value())))
  return [value, setValue]
}
