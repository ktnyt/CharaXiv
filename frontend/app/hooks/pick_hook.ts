export const pickHook = <T extends unknown>(useClient: T, useServer: T) =>
  typeof window === 'undefined' ? useServer : useClient
