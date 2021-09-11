import { useEffect, useRef } from 'react'

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isUpdate = useRef(false)

  useEffect(() => {
    if (isUpdate.current) {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    isUpdate.current = true
  }, [])
}
