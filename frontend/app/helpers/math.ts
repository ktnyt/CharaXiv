export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

export const sum = (...args: number[] | number[][]): number =>
  args.flat().reduce((a, b) => a + b, 0)
