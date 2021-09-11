import { useEffect, useRef, useState } from 'react'
import { useInterval } from './useInterval'

export const useThrottle = <T extends unknown>(value: T, interval = 100): T => {
  const ref = useRef(value)
  const [state, setState] = useState(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  useInterval(() => setState(ref.current), interval)

  return state
}
