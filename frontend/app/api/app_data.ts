import { createJsonClient } from './client'

export interface AppData {
  systems: {
    value: string
    label: string
  }[]
}

export const getAppData = async () => {
  const client = createJsonClient()
  const res = await client.get<AppData>('/app_data')
  if (res.status !== 200) return res.status
  return res.data
}
