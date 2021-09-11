import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'node:querystring'
import nookies from 'nookies'
import { getUserSystem } from './api/user'

export const handleServerCookies = async <Query extends ParsedUrlQuery>(
  ctx: GetServerSidePropsContext<Query>,
) => {
  const cookies = nookies.get(ctx)

  const token = 'token' in cookies ? cookies.token : undefined

  if (token) {
    nookies.set(ctx, 'token', token, {
      maxAge: 60 * 60 * 24 * 14,
      path: '/',
    })
  }

  if ('system' in cookies) {
    nookies.set(ctx, 'system', cookies.system, {
      maxAge: 60 * 60 * 24 * 14,
      path: '/',
    })
  }

  if (token) {
    const system = await getUserSystem(token)
    if (typeof system !== 'number') {
      nookies.set(ctx, 'system', system, {
        maxAge: 60 * 60 * 24 * 14,
        path: '/',
      })
    }
  }

  return token
}
