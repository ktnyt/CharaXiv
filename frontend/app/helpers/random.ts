export const randomElement = <T extends unknown>(values: T[]) =>
  values[Math.floor(Math.random() * values.length)]
