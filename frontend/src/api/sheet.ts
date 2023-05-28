import { Sheet } from '@charaxiv/types/common/sheet'
import { client } from './client'

export const callSheetList = async (system: string) => {
  const response = await client
    .get(`/sheet?system=${system}`)
    .json<{ sheets: Sheet<any>[] }>()
  return response.sheets
}

export const callSheetCreate = async (system: string) =>
  await client.post({ system }, '/sheet').text()

export const callSheetGet = async (sheet_id: string) =>
  await client.get(`/sheet/${sheet_id}`).json<Sheet<any>>()
