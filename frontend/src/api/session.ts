import { ResponseBase, client } from "./client";

class UserVerificationFailedError extends Error {
  static {
    this.prototype.name = "UserVerificationFailedError";
  }
}

export default {
  UserVerificationFailedError,

  get: async () => {
    const response = await client
      .get("/session")
      .json<ResponseBase<{ authenticated: boolean }>>();
    switch (response.error) {
      case null:
        return response.value.authenticated;
      default:
        throw new Error(`unexpected error "${response.error}"`);
    }
  },

  post: async (params: { email: string; password: string }) => {
    const response = await client.post(params, "/session").json<ResponseBase>();
    switch (response.error) {
      case null:
        return;
      case "UserVerificationFailed":
        throw new UserVerificationFailedError();
      default:
        throw new Error(`unexpected error "${response.error}"`);
    }
  },

  delete: async () => {
    const response = await client.delete("/session").json<ResponseBase>();
    switch (response.error) {
      case null:
        return;
      default:
        throw new Error(`unexpected error "${response.error}"`);
    }
  },
};
