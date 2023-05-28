import { CHARAXIV_API_FQDN } from '@charaxiv/constants'
import wretch, { ConfiguredMiddleware } from 'wretch'
import { retry, dedupe } from 'wretch/middlewares'

const apiClient = wretch(CHARAXIV_API_FQDN).options({ credentials: 'include' })

const csrfMiddleware: ConfiguredMiddleware =
  (next) =>
  async (url, { headers, ...options }) =>
    next(url, {
      headers: {
        ...headers,
        'X-XSRF-Token': await apiClient.get('/csrf_token').text(),
      },
      ...options,
    })

export const client = wretch(CHARAXIV_API_FQDN)
  .options({ credentials: 'include' })
  .middlewares([csrfMiddleware, retry(), dedupe()])
