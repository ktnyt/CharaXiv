import { createFormClient, createJsonClient } from './client'

export const uploadImage = async (
  sheetId: string,
  image: File,
  token: string,
) => {
  const client = createFormClient(token)
  const res = await client.post<string>('/image/upload', { sheetId, image })
  return res.data
}
export const removeImage = async (
  sheetId: string,
  name: string,
  token: string,
) => {
  const client = createJsonClient(token)
  const res = await client.post<boolean>('/image/remove', { sheetId, name })
  return res.data
}
