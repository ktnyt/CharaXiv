import { createRoot, createSignal } from 'solid-js'

export type ResizeObserverCallback = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver,
) => void

type CallbackMap = Map<Element, ResizeObserverCallback[]>

const createResizeObserver = () => {
  const [callbackMap, setCallbackMap] = createSignal<CallbackMap>(new Map())

  const observer = new ResizeObserver((entries, observer) =>
    entries.forEach((entry) =>
      (callbackMap().get(entry.target) ?? []).forEach((callback) =>
        callback(entry, observer),
      ),
    ),
  )

  const subscribe = (el: HTMLElement, cb: ResizeObserverCallback) => {
    setCallbackMap((prev) => prev.set(el, [...(prev.get(el) ?? []), cb]))
    observer.observe(el)
  }

  const unsubscribe = (el: HTMLElement, cb: ResizeObserverCallback) => {
    setCallbackMap((prev) => {
      const callbacks = prev.get(el)
      if (!callbacks) {
        return prev
      }
      if (callbacks.length === 1) {
        observer.unobserve(el)
        prev.delete(el)
        return prev
      }
      const cbIndex = callbacks.indexOf(cb)
      return prev.set(
        el,
        callbacks.filter((_, index) => index !== cbIndex),
      )
    })
  }

  return { observer, subscribe, unsubscribe }
}

export const { observer, subscribe, unsubscribe } =
  createRoot(createResizeObserver)
