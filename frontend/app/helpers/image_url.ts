export const getImageHost = () =>
  typeof window === 'undefined'
    ? process.env.IMAGE_HOST
    : process.env.NEXT_PUBLIC_IMAGE_HOST

export const imageUrl = (path: string) => `${getImageHost()}/${path}`
