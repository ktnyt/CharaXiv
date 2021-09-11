import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, interval: number) => {
  const ref = useRef(callback)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  useEffect(() => {
    if (interval > 0) {
      const handler = setInterval(ref.current, interval)
      return () => clearInterval(handler)
    }
  }, [interval])
}
