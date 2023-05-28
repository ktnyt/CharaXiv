import { Accessor, createSignal } from 'solid-js'

export type RefSetter<T> = (value: T) => void

export const createRef = <T>(): [Accessor<T>, RefSetter<T>] => {
  const [ref, setRef] = createSignal<T>()
  const accessor = () => {
    const value = ref()
    if (typeof value === 'undefined') throw new Error('ref has not been set')
    return value
  }
  const setter = (value: T) => setRef(() => value)
  return [accessor, setter]
}
