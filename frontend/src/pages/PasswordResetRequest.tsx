import * as EmailValidator from "email-validator";
import { callPasswordResetRequest } from "@charaxiv/api/user";
import { Button } from "@charaxiv/components/Button";
import { Input } from "@charaxiv/components/Input";
import { Label } from "@charaxiv/components/Label";
import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { useNavigate } from "@solidjs/router";
import { Component, Show, createSignal } from "solid-js";

export const PasswordResetRequestPage: Component = () => {
  const navigate = useNavigate();

  const [email, emailSet] = createSignal<string>();
  const [emailFocus, emailFocusSet] = createSignal(false);

  const formInvalid = () => !EmailValidator.validate(email() ?? "");

  const showEmailInvalidError = () => {
    const currentEmail = email();
    return (
      !emailFocus() &&
      currentEmail !== undefined &&
      !EmailValidator.validate(currentEmail)
    );
  };

  const onSubmitPasswordResetRequestForm = async () => {
    const accountEmail = email();
    if (accountEmail && !formInvalid()) {
      const response = await callPasswordResetRequest(accountEmail);
      switch (response.error) {
        case null:
          navigate(
            `/password_reset_request_sent?email=${encodeURIComponent(
              accountEmail,
            )}`,
          );
          return;

        case "UserWithEmailNotFound":
          alert("入力されたメールアドレスのユーザが存在しません。");
          return;

        default:
          throw new Error(response.error);
      }
    }
  };

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="w-full pb-4 pt-2">
          <h2 class="text-center text-3xl sm:text-left">
            パスワード再設定リクエスト
          </h2>
        </div>

        <div class="w-full pb-4">
          <span class="text-sm">
            登録したアカウントのメールアドレスを入力してください。
          </span>
        </div>

        <div class="w-full">
          <form
            class="flex flex-col space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitPasswordResetRequestForm();
            }}
          >
            <div>
              <Label for="email" class="flex flex-row justify-between">
                <span>メールアドレス</span>
                <Show when={showEmailInvalidError()}>
                  <span class="text-xs text-red-500"> 値が不正です</span>
                </Show>
              </Label>
              <Input
                name="email"
                type="email"
                autocomplete="username"
                required
                color={showEmailInvalidError() ? "red" : "default"}
                value={email()}
                onInput={(event) => emailSet(event.currentTarget.value)}
                onFocus={() => emailFocusSet(true)}
                onBlur={() => emailFocusSet(false)}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              color="green"
              fullWidth
              disabled={formInvalid()}
            >
              確認メール送信
            </Button>
          </form>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
};

export default PasswordResetRequestPage;
