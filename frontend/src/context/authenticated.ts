import { callAuthenticated } from '@charaxiv/api/user'
import { createResource, createRoot } from 'solid-js'

export const [authenticated, { refetch: refetchAuthenticated }] = createRoot(
  () => createResource<boolean>(async () => await callAuthenticated()),
)
