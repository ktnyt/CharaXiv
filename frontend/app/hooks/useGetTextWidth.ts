import { RefObject, useRef } from 'react'
import { pickHook } from './pick_hook'

const useServer = () => (_: string) => 8

const useClient = <T extends HTMLElement>(element: RefObject<T>, min = 0) => {
  const canvas = useRef(document.createElement('canvas'))
  const context = useRef(canvas.current.getContext('2d'))
  return (text: string) => {
    if (!element.current || !context.current) {
      return min
    }
    const styles = getComputedStyle(element.current)
    const font = `${styles.fontSize} ${styles.fontFamily}`
    context.current.font = font
    return Math.max(context.current.measureText(text).width, min)
  }
}

export const useGetTextWidth = pickHook(useClient, useServer)
