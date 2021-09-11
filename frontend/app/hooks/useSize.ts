import { RefObject, useLayoutEffect, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { pickHook } from './pick_hook'

const useServer = <E extends HTMLElement>(ref: RefObject<E>) => ({
  width: 0,
  height: 0,
})

const useClient = <E extends HTMLElement>(ref: RefObject<E>) => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const target = ref.current
    if (target) {
      const { width, height } = target.getBoundingClientRect()
      setSize({ width, height })
    }
  }, [ref])

  useResizeObserver(ref, (event) => {
    const { width, height } = event.contentRect
    setSize({ width, height })
  })

  return size
}

export const useSize = pickHook(useClient, useServer)
