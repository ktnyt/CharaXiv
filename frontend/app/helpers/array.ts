export const range = (min: number, max: number, step = 1) =>
  Array.from(
    new Array(Math.floor((max - min) / step) + 1),
    (_, index) => min + index * step,
  )

export const generate = (n: number, f: () => number) => range(0, n).map(f)

export const head = <T extends unknown>(array: T[], index: number) =>
  array.slice(0, index)
export const tail = <T extends unknown>(array: T[], index: number) =>
  array.slice(index)
export const shift = <T extends unknown>(array: T[]) => tail(array, 1)
export const pop = <T extends unknown>(array: T[]) => head(array, -1)

export const append = <T extends unknown>(array: T[], value: T) => [
  ...array,
  value,
]
export const insert = <T extends unknown>(
  array: T[],
  value: T,
  index: number = 0,
) => [...head(array, index), value, ...tail(array, index)]

export const remove = <T extends unknown>(array: T[], index: number) => [
  ...head(array, index),
  ...tail(array, index + 1),
]

export const replace = <T extends unknown>(
  array: T[],
  value: T,
  index: number,
) => [...head(array, index), value, ...tail(array, index + 1)]

export const swap = <T extends unknown>(
  array: T[],
  value: (arg: T) => T,
  index: number,
) => [...head(array, index), value(array[index]), ...tail(array, index + 1)]

export const appender =
  <T extends unknown>(value: T) =>
  (array: T[]) =>
    append(array, value)

export const inserter =
  <T extends unknown>(value: T, index: number) =>
  (array: T[]) =>
    insert(array, value, index)

export const remover =
  <T extends unknown>(index: number) =>
  (array: T[]) =>
    remove(array, index)

export const replacer =
  <T extends unknown>(value: T, index: number) =>
  (array: T[]) =>
    replace(array, value, index)

export const swapper =
  <T extends unknown>(value: (arg: T) => T, index: number) =>
  (array: T[]) =>
    swap(array, value, index)
