import { useEffect } from 'react'
import { setCookie } from 'nookies'
import { useCookies } from '@/context/CookiesContext'
import { pickHook } from './pick_hook'
import { useLocalStorage } from './useLocalStorage'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

const useServer = (): [boolean, () => void] => {
  const cookies = useCookies()
  const isDark =
    'color-scheme' in cookies ? cookies['color-scheme'] === 'dark' : false
  return [isDark, () => {}]
}

const useClient = (): [boolean, () => void] => {
  const getPrefersScheme = () => window.matchMedia(COLOR_SCHEME_QUERY).matches

  const [isDark, setIsDark] = useLocalStorage<boolean>(
    'color_scheme',
    getPrefersScheme(),
  )

  useEffect(() => {
    setCookie(null, 'color-scheme', isDark ? 'dark' : 'light', {
      maxAge: 60 * 60 * 24 * 13,
      path: '/',
    })
  }, [isDark])

  useEffect(() => {
    const handler = () => setIsDark(getPrefersScheme)
    const matchMedia = window.matchMedia(COLOR_SCHEME_QUERY)
    matchMedia.addEventListener('change', handler)
    return () => {
      matchMedia.removeEventListener('change', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [isDark, () => setIsDark((prev) => !prev)]
}

export const useColorScheme = pickHook(useClient, useServer)
