import { useEffect, useState } from 'react'

export const useRendered = () => {
  const [rendered, setRendered] = useState(false)
  useEffect(() => {
    setRendered(true)
  }, [])
  return rendered
}
