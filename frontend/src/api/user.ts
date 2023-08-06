import { ResponseBase, client } from "./client";

export const callAuthenticated = async () =>
  await client.get("/session").json<ResponseBase<{ authenticated: boolean }>>();

export const callRegister = (email: string) =>
  client.post({ email }, "/register").json<ResponseBase>();

export const callActivate = (
  token: string,
  username: string,
  password: string,
) =>
  client.post({ token, username, password }, "/activate").json<ResponseBase>();

export const callPasswordResetRequest = (email: string) =>
  client.post({ email }, "/password_reset").json<ResponseBase>();

export const callPasswordReset = (token: string, password: string) =>
  client.put({ token, password }, "/password_reset").json<ResponseBase>();

export const callLogin = (email: string, password: string) =>
  client.post({ email, password }, "/session").json<ResponseBase>();

export const callLogout = () => client.delete("/session").json<ResponseBase>();
