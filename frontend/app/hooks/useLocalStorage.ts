import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { pickHook } from './pick_hook'
import { useIsMounted } from './useIsMounted'

export type SetValue<T> = Dispatch<SetStateAction<T>>

const useServer = <T extends unknown>(key: string, init: T): [T, SetValue<T>] =>
  useState(init)

const useClient = <T extends unknown>(
  key: string,
  init: T,
): [T, SetValue<T>] => {
  const isMounted = useIsMounted()

  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : init
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
      return init
    }
  }

  const [currentValue, setCurrentValue] = useState<T>(readValue)
  const setValueIfMounted = (value: T) => {
    if (isMounted()) {
      setCurrentValue(value)
    }
  }

  const setValue: SetValue<T> = (value) => {
    try {
      const nextValue = value instanceof Function ? value(currentValue) : value
      window.localStorage.setItem(key, JSON.stringify(nextValue))
      setValueIfMounted(nextValue)
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }

  useEffect(() => {
    setValueIfMounted(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      setValueIfMounted(readValue())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('local-storage', handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [currentValue, setValue]
}

export const useLocalStorage = pickHook(useClient, useServer)

export const useLocalStorageValue = <T extends unknown>(
  key: string,
  init: T,
) => {
  const [value] = useLocalStorage(key, init)
  return value
}
