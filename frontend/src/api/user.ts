import { Username } from '@charaxiv/types/common/user'
import { client } from './client'

export const callAuthenticated = async () =>
  await client.get('/user/authenticated').json<boolean>()

export const callUsernameTaken = async (key: string, tag: number) =>
  await client.get(`/user/name_taken?key=${key}&tag=${tag}`).json<boolean>()

export const callRegister = (email: string) =>
  client.post({ email }, '/user/register').text()

export const callActivate = (
  token: string,
  username: Username,
  password: string,
) => client.post({ token, username, password }, '/user/activate').text()

export const callLogin = (email: string, password: string) =>
  client.post({ email, password }, '/user/login').text()

export const callLogout = () => client.post({}, '/user/logout').text()
