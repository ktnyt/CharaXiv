import { Status, VariableKey } from '../types'

export const convertToNumber = (value: string): number =>
  value.match(/^\d+$/) ? Number(value) : 0

export const maxVariableValue = (status: Status, keys: VariableKey[]): number =>
  Math.max(...keys.map((key) => status.variables[key]))

export const maxVariableIndex = (
  status: Status,
  keys: VariableKey[],
): number => {
  const values = keys.map((key) => status.variables[key])
  return values.indexOf(Math.max(...values))
}

export const maxVariableKey = (
  status: Status,
  keys: VariableKey[],
): VariableKey => keys[maxVariableIndex(status, keys)]
