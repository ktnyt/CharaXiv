import { callPasswordReset } from "@charaxiv/api/user";
import { Button } from "@charaxiv/components/Button";
import { Input } from "@charaxiv/components/Input";
import { Label } from "@charaxiv/components/Label";
import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { MINIMUM_PASSWORD_LENGTH } from "@charaxiv/constants";
import { useNavigate, useSearchParams } from "@solidjs/router";
import clsx from "clsx";
import { Component, JSX, Match, Switch, createSignal } from "solid-js";

export const PasswordResetPage: Component = () => {
  const navigate = useNavigate();

  const [{ token: password_reset_token }] = useSearchParams<{
    token?: string;
  }>();

  if (!password_reset_token) {
    navigate("/");
    return null;
  }

  const [rawPassword, rawPasswordSet] = createSignal<string>();

  const passwordHasLower = () => /[a-z]/.test(rawPassword() ?? "");
  const passwordHasUpper = () => /[A-Z]/.test(rawPassword() ?? "");
  const passwordHasDigit = () => /[0-9]/.test(rawPassword() ?? "");
  const passwordHasOther = () =>
    /[!"#$%&\"\(\)*+,-./:;<=>?@\[\]\\^_`{|}~]/.test(rawPassword() ?? "");
  const passwordHasLength = () =>
    (rawPassword() ?? "").length >= MINIMUM_PASSWORD_LENGTH;

  const passwordHasError = () =>
    !(
      passwordHasLower() &&
      passwordHasUpper() &&
      passwordHasDigit() &&
      passwordHasOther() &&
      passwordHasLength()
    );

  const formInvalid = () => passwordHasError();

  const onSubmitPasswordResetForm: JSX.DOMAttributes<HTMLFormElement>["onSubmit"] =
    async (event) => {
      event.preventDefault();

      if (formInvalid()) {
        return;
      }

      const password = rawPassword()!;
      const response = await callPasswordReset(password_reset_token, password);

      switch (response.error) {
        case null:
          navigate("/");
          return;

        case "PasswordResetRequestNotFound":
          alert("無効な登録リンクです。再度パスワード再設定をお試しください。");
          navigate("/password_reset_request");
          return;

        case "PasswordResetRequestExpired":
          alert(
            "登録リンクの有効期限が切れています。再度パスワード再設定をお試しください。",
          );
          navigate("/password_reset_request");
          return;

        default:
          throw new Error(response.error);
      }
    };

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="w-full pb-4 pt-2">
          <h2 class="text-center text-3xl sm:text-left">パスワード再設定</h2>
        </div>

        <div class="w-full">
          <form
            class="flex flex-col space-y-2"
            autocomplete="on"
            onSubmit={onSubmitPasswordResetForm}
          >
            <div>
              <Label for="password">パスワード</Label>
              <Input
                name="password"
                type="password"
                autocomplete="new-password"
                color={
                  rawPassword()
                    ? passwordHasError()
                      ? "red"
                      : "green"
                    : "default"
                }
                onInput={(event) => rawPasswordSet(event.currentTarget.value)}
              />
              <span class="text-xs">
                <span
                  class={clsx(
                    rawPassword() && !passwordHasLower() && "text-red-500",
                    rawPassword() && passwordHasLower() && "text-green-500",
                  )}
                >
                  小文字
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasUpper() && "text-red-500",
                    rawPassword() && passwordHasUpper() && "text-green-500",
                  )}
                >
                  大文字
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasDigit() && "text-red-500",
                    rawPassword() && passwordHasDigit() && "text-green-500",
                  )}
                >
                  数字
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasOther() && "text-red-500",
                    rawPassword() && passwordHasOther() && "text-green-500",
                  )}
                >
                  記号
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasLength() && "text-red-500",
                    rawPassword() && passwordHasLength() && "text-green-500",
                  )}
                >
                  {MINIMUM_PASSWORD_LENGTH}文字以上
                </span>
              </span>
            </div>

            <Button
              type="submit"
              variant="default"
              color="green"
              fullWidth
              disabled={formInvalid()}
            >
              パスワードを再設定する
            </Button>
          </form>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
};

export default PasswordResetPage;
