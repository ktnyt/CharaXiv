import { pickHook } from './pick_hook'

const useClient = () => window.location.href

const useServer = () => ''

export const useHref = pickHook(useClient, useServer)
