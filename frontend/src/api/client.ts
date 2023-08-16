import { CHARAXIV_API_FQDN, CHARAXIV_CUSTOM_HEADER } from "@charaxiv/constants";
import wretch, { ConfiguredMiddleware } from "wretch";
import { retry, dedupe } from "wretch/middlewares";

export const client = wretch(CHARAXIV_API_FQDN)
  .options({
    credentials: "include",
    headers: {
      [CHARAXIV_CUSTOM_HEADER]: 1,
    },
  })
  .middlewares([
    retry({
      until: (response, error) =>
        response !== undefined && (response.ok || 500 <= response.status),
    }),
    dedupe(),
  ]);

export type ResponseBase<T = undefined> =
  | {
      error: null;
      value: T;
    }
  | {
      error: string;
      value: null;
    };

export class ApiError<T extends string> extends Error {
  constructor(public label: T) {
    super(label);
  }

  static {
    this.prototype.name = "ApiError";
  }
}
