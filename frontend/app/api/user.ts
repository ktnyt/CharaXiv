import { asParams, createJsonClient } from './client'

export const login = async (username: string, passcode: string) => {
  const client = createJsonClient()
  const params = asParams({ username, passcode })
  const res = await client.get<string>('/login', { params })
  if (res.status !== 200) return res.status
  return res.data
}

export const register = async (username: string) => {
  const client = createJsonClient()
  const params = asParams({ username })
  const res = await client.get<string>('/register', { params })
  return res.data
}

export const verify = async (username: string, passcode: string) => {
  const client = createJsonClient()
  const params = asParams({ username, passcode })
  const res = await client.get<string>('/verify', { params })
  return res.data
}

export const getUserSystem = async (token: string) => {
  const client = createJsonClient(token)
  const res = await client.get<string>('/system')
  if (res.status !== 200) return res.status
  return res.data
}

export const setUserSystem = async (system: string, token: string) => {
  const client = createJsonClient(token)
  const res = await client.post<boolean>('/system', { system })
  if (res.status !== 200) return res.status
  return res.data
}
