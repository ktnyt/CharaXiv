import { asParams, createJsonClient } from './client'

export interface Sheet {
  id: string
  system: string
  own: boolean
  name: string
  ruby: string
  tags: string[]
  memo: any
  secret: any
  data: any
  images: string[]
}

export const listSheets = async (system: string, token: string) => {
  const params = asParams({ system })
  const client = createJsonClient(token)
  const res = await client.get<Sheet[]>(`/sheet`, { params })
  return res.data
}

export const getSheet = async (sheetId: string, token?: string) => {
  const client = createJsonClient(token)
  const res = await client.get<Sheet>(`/sheet/${sheetId}`)
  if (res.status !== 200) return res.status
  return res.data
}

export const createSheet = async (system: string, token: string) => {
  const client = createJsonClient(token)
  const res = await client.post<string>('/sheet', { system })
  if (res.status !== 200) return res.status
  return res.data
}

export const deleteSheet = async (sheetId: string, token: string) => {
  const client = createJsonClient(token)
  const res = await client.delete<boolean>(`/sheet/${sheetId}`)
  if (res.status !== 200) return res.status
  return res.data
}

export type SheetPatch = Partial<{
  name: string
  ruby: string
  tags: string[]
  memo: any
  secret: any
  data: any
}>

export const updateSheet = async (
  sheetId: string,
  patch: SheetPatch,
  token: string,
) => {
  const client = createJsonClient(token)
  const res = await client.put<boolean>(`/sheet/${sheetId}`, patch)
  return res.data
}
