export const reinsert = <T extends unknown>(
  array: T[],
  i: number,
  j: number,
) =>
  i < j
    ? [
        ...array.slice(0, i),
        ...array.slice(i + 1, j + 1),
        array[i],
        ...array.slice(j + 1),
      ]
    : j < i
    ? [
        ...array.slice(0, j),
        array[i],
        ...array.slice(j, i),
        ...array.slice(i + 1),
      ]
    : array;
