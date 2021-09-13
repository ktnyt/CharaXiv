import { Status, VariableKey } from '../types'

export const convertToNumber = (value: string): number =>
  value.match(/^\d+$/) ? Number(value) : 0

export const maxVariable = (status: Status, keys: VariableKey[]): number =>
  Math.max(...keys.map((key) => status.variables[key]))

export const maxVariableKey = (
  status: Status,
  keys: VariableKey[],
): VariableKey => {
  const values = keys.map((key) => status.variables[key])
  const index = values.indexOf(Math.max(...values))
  return keys[index]
}
