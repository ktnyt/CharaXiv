import { Username } from '@charaxiv/types/common/user'
import { ResponseBase, client } from './client'

export const callAuthenticated = async () =>
  await client.get('/session').json<ResponseBase<{ authenticated: boolean }>>()

export const callUsernameTaken = async (key: string, tag: number) =>
  await client.get(`/name_taken?key=${key}&tag=${tag}`).json<boolean>()

export const callRegister = (email: string) =>
  client.post({ email }, '/register').json<ResponseBase>()

export const callActivate = (
  token: string,
  username: Username,
  password: string,
) =>
  client.post({ token, username, password }, '/activate').json<ResponseBase>()

export const callLogin = (email: string, password: string) =>
  client.post({ email, password }, '/session').json<ResponseBase>()

export const callLogout = () => client.delete('/session').json<ResponseBase>()
