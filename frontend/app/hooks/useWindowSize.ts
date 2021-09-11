import { useEffect, useState } from 'react'
import { pickHook } from './pick_hook'

const useServer = () => ({ width: 0, height: 0 })

const useClient = () => {
  const getSize = () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })

  const [size, setSize] = useState(getSize())

  useEffect(() => {
    const onResize = () => setSize(getSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

export const useWindowSize = pickHook(useClient, useServer)
