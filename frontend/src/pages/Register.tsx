import { Button } from "@charaxiv/components/Button";
import { Input } from "@charaxiv/components/Input";
import { Component, createEffect, createSignal, Show } from "solid-js";
import * as EmailValidator from "email-validator";
import { useNavigate } from "@solidjs/router";
import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { Label } from "@charaxiv/components/Label";
import api from "@charaxiv/api";

export const RegisterPage: Component = () => {
  const navigate = useNavigate();

  const [emailSignal, emailSignalSet] = createSignal<string>();
  const [emailFocusSignal, emailFocusSignalSet] = createSignal(false);

  const formInvalidSignal = () => !EmailValidator.validate(emailSignal() ?? "");

  const showEmailInvalidError = () => {
    const currentEmail = emailSignal();
    return (
      !emailFocusSignal() &&
      currentEmail !== undefined &&
      !EmailValidator.validate(currentEmail)
    );
  };

  const onSubmitRegistrationForm = async () => {
    const email = emailSignal();
    if (email && !formInvalidSignal()) {
      try {
        await api.user.post({ email });
        navigate(`/register_sent?email=${encodeURIComponent(email)}`);
      } catch (e) {
        if (e instanceof api.user.UserWithEmailExistsError) {
          alert("入力されたメールアドレスはすでに登録済みです。");
          return;
        }
        throw e;
      }
    }
  };

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-center text-3xl sm:text-left">メールアドレス確認</h2>
        </div>

        <div class="w-full pb-4">
          <span class="text-sm">
            ユーザ登録に使用するメールアドレスを入力してください。
          </span>
        </div>

        <div class="w-full">
          <form
            class="flex flex-col space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitRegistrationForm();
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
                value={emailSignal()}
                onInput={(event) => emailSignalSet(event.currentTarget.value)}
                onFocus={() => emailFocusSignalSet(true)}
                onBlur={() => emailFocusSignalSet(false)}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              color="green"
              fullWidth
              disabled={formInvalidSignal()}
            >
              確認メール送信
            </Button>
          </form>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
};

export default RegisterPage;
