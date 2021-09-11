const toCamelCase = (sep: RegExp) => (str: string) =>
  str.replace(sep, (c) => c.charAt(1).toUpperCase())

const fromCamelCase = (sep: string) => (str: string) =>
  str
    .split(/(?=[A-Z][^A-Z])/)
    .join(sep)
    .toLowerCase()

export const camel = {
  toSnake: fromCamelCase('_'),
  toKebab: fromCamelCase('-'),
}

export const kebab = {
  toCamel: toCamelCase(/-\w/g),
  toSnake: (str: string) => str.replace('-', '_'),
}

export const snake = {
  toCamel: toCamelCase(/_\w/g),
  toKebab: (str: string) => str.replace('_', '-'),
}
