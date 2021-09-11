import { createContext, useContext } from 'react'

export type Cookies = { [key: string]: string }

export const CookiesContext = createContext<Cookies>({})
export const useCookies = () => useContext(CookiesContext)
export const useCookie = (key: string) => {
  const cookies = useCookies()
  return key in cookies ? cookies[key] : undefined
}
