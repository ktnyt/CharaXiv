import { Accessor, JSX } from 'solid-js'

export const delegateJSXEvent =
  <T extends HTMLElement, E extends Event>(
    accessor: Accessor<JSX.EventHandlerUnion<T, E> | undefined>,
  ): JSX.EventHandler<T, E> =>
  (event) => {
    const handler = accessor()
    if (handler) {
      if (typeof handler === 'function') {
        handler(event)
      } else {
        handler[0](handler[1], event)
      }
    }
  }

export type EventHandler<E extends Event> = (ev: E) => void

export const delegateEvent =
  <E extends Event>(
    accessor: Accessor<EventHandler<E> | undefined>,
  ): EventHandler<E> =>
  (event) => {
    const handler = accessor()
    if (handler) handler(event)
  }

export const notNull =
  <T, U>(callback: (value: NonNullable<T>) => U) =>
  (value: T) => {
    if (value === null || value === undefined) return value
    return callback(value)
  }

export const swapElement = <T>(array: T[], index: number, value: T) => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1),
]
