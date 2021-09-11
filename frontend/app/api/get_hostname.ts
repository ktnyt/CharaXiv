export const getHostname = () =>
  typeof window === 'undefined'
    ? process.env.SERVERSIDE_HOST
    : process.env.CLIENTSIDE_HOST
