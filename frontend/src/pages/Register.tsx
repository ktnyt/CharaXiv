import { Button } from "@charaxiv/components/Button";
import { Input } from "@charaxiv/components/Input";
import { Component, createEffect, createSignal, Show } from "solid-js";
import * as EmailValidator from "email-validator";
import { callRegister } from "@charaxiv/api/user";
import { useNavigate } from "@solidjs/router";
import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { Label } from "@charaxiv/components/Label";

export const RegisterPage: Component = () => {
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

  const onSubmitRegistrationForm = async () => {
    const registrantAddress = email();
    if (registrantAddress && !formInvalid()) {
      const response = await callRegister(registrantAddress);
      switch (response.error) {
        case null:
          navigate(
            `/register_sent?email=${encodeURIComponent(registrantAddress)}`,
          );
          return;

        case "UserWithEmailExistsException":
          alert("入力されたメールアドレスはすでに登録済みです。");
          return;

        default:
          throw new Error(response.error);
      }
    }
  };

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col space-y-2 justify-center items-center">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-3xl text-center sm:text-left">メールアドレス確認</h2>
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

export default RegisterPage;
