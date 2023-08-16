import { ResponseBase, client } from "./client";

export const callPasswordResetRequest = (email: string) =>
  client.post({ email }, "/password_reset").json<ResponseBase>();

export const callPasswordReset = (token: string, password: string) =>
  client.put({ token, password }, "/password_reset").json<ResponseBase>();

class RegistrationNotFoundError extends Error {
  static {
    this.prototype.name = "RegistrationNotFoundError";
  }
}

class UserWithEmailExistsError extends Error {
  static {
    this.prototype.name = "UserWithEmailExistsError";
  }
}

class UserWithUsernameExistsError extends Error {
  static {
    this.prototype.name = "UserWithUsernameExistsError";
  }
}

class RegistrationExpiredError extends Error {
  static {
    this.prototype.name = "RegistrationExpiredError";
  }
}

export default {
  RegistrationNotFoundError,
  UserWithEmailExistsError,
  UserWithUsernameExistsError,
  RegistrationExpiredError,

  post: async (params: { email: string }) => {
    const response = await client.post(params, "/user").json<ResponseBase>();
    switch (response.error) {
      case null:
        return;
      case "UserWithEmailExists":
        throw new UserWithEmailExistsError();
      default:
        throw new Error(`unexpected error "${response.error}"`);
    }
  },

  put: async (params: {
    token: string;
    username: string;
    password: string;
  }) => {
    const response = await client.put(params, "/user").json<ResponseBase>();
    switch (response.error) {
      case null:
        return;
      case "RegistrationNotFound":
        throw new RegistrationNotFoundError();
      case "UserWithEmailExists":
        throw new UserWithEmailExistsError();
      case "UserWithUsernameExists":
        throw new UserWithUsernameExistsError();
      case "RegistrationExpired":
        throw new RegistrationExpiredError();
      default:
        throw new Error(`unexpected error "${response.error}"`);
    }
  },
};
