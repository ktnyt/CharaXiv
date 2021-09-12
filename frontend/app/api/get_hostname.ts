export const getHostname = () =>
  typeof window === 'undefined'
    ? process.env.BACKEND_HOST
    : process.env.NEXT_PUBLIC_BACKEND_HOST
