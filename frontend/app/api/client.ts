import axios from 'axios'
import { camel, snake } from '@/helpers/case_conversion'
import { getHostname } from './get_hostname'

export const asForm = (data: Record<string, string | Blob>): FormData => {
  const form = new FormData()
  Object.entries(data).forEach(([name, value]) => {
    form.append(name, value)
  })
  return form
}

export const asParams = (data: Record<string, string>): URLSearchParams => {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([name, value]) => {
    params.append(name, value)
  })
  return params
}

export const transformKeys = (
  data: any,
  f: (key: string) => string,
  depth = -1,
): any => {
  if (depth === 0) {
    return data
  }

  if (
    data === null ||
    ['undefined', 'boolean', 'number', 'string'].includes(typeof data)
  ) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformKeys(item, f, depth - 1))
  }

  const entries = Object.entries(data).map(([key, value]) => [
    f(key),
    transformKeys(value, f, depth - 1),
  ])

  return Object.fromEntries(entries)
}

const addAuthorization = (headers: Record<string, string>, token?: string) =>
  token ? { ...headers, Authorization: `Bearer ${token}` } : headers

export const createJsonClient = (token?: string) =>
  axios.create({
    baseURL: getHostname(),
    headers: addAuthorization(
      {
        'Content-Type': 'application/json',
      },
      token,
    ),
    transformRequest: (data) =>
      JSON.stringify(transformKeys(data, camel.toSnake)),
    transformResponse: (data) => transformKeys(JSON.parse(data), snake.toCamel),
  })

export const createFormClient = (token?: string) =>
  axios.create({
    baseURL: getHostname(),
    headers: addAuthorization(
      {
        'Content-Type': 'multipart/form-data',
      },
      token,
    ),
    transformRequest: (data: Record<string, string | Blob>) =>
      asForm(transformKeys(data, camel.toSnake, 1)),
    transformResponse: (data) => transformKeys(JSON.parse(data), snake.toCamel),
  })
