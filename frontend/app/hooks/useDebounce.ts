import { useEffect, useRef, useState } from 'react'

const neverForceUpdate = () => false

interface DebounceOptions<T> {
  delay: number
  forceUpdate: (value: T) => boolean
}

const getFilledOptions = <T extends unknown>({
  delay = 1000,
  forceUpdate = neverForceUpdate,
}: Partial<DebounceOptions<T>>): DebounceOptions<T> => ({ delay, forceUpdate })

const getDefaultOptions = <T extends unknown>(
  options?: Partial<DebounceOptions<T>>,
): DebounceOptions<T> =>
  options
    ? getFilledOptions(options)
    : { delay: 1000, forceUpdate: neverForceUpdate }

export const useDebounce = <T extends unknown>(
  next: T,
  options?: Partial<DebounceOptions<T>>,
) => {
  const { delay, forceUpdate } = getDefaultOptions(options)

  const forceUpdateRef = useRef(forceUpdate)
  useEffect(() => {
    forceUpdateRef.current = forceUpdate
  }, [forceUpdate])

  const [value, setValue] = useState(next)

  useEffect(() => {
    if (forceUpdateRef.current(next)) {
      setValue(next)
    }
    const timeout = setTimeout(() => setValue(next), delay)
    return () => {
      clearTimeout(timeout)
    }
  }, [next, delay])

  return value
}
