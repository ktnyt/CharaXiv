import { callActivate } from "@charaxiv/api/user";
import { Button } from "@charaxiv/components/Button";
import { Input } from "@charaxiv/components/Input";
import { Label } from "@charaxiv/components/Label";
import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { MINIMUM_PASSWORD_LENGTH } from "@charaxiv/constants";
import { createDebounce } from "@charaxiv/hooks/createDebounce";
import { useNavigate, useSearchParams } from "@solidjs/router";
import clsx from "clsx";
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  Match,
  Switch,
} from "solid-js";

export const ActivatePage: Component = () => {
  const navigate = useNavigate();

  const [{ email, token }] = useSearchParams<{
    email?: string;
    token?: string;
  }>();

  if (!email || !token) {
    navigate("/");
    return null;
  }

  const [rawUsername, rawUsernameSet] = createSignal<string>();
  const [usernameTaken, usernameTakenSet] = createSignal(false);

  const debouncedUsername = createDebounce(rawUsername, 500);

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

  const formInvalid = () =>
    rawUsername() === undefined || rawUsername() === "" || passwordHasError();

  const onSubmitActivationForm: JSX.DOMAttributes<HTMLFormElement>["onSubmit"] =
    async (event) => {
      event.preventDefault();

      if (formInvalid()) {
        return;
      }

      const username = debouncedUsername()!;
      const password = rawPassword()!;
      const response = await callActivate(token, username, password);

      switch (response.error) {
        case null:
          navigate("/");
          return;

        case "RegistrationNotFoundException":
          alert("無効な登録リンクです。再度新規登録をお試しください。");
          navigate("/register");
          return;

        case "UserWithEmailExistsException":
          alert(
            "メールアドレスがすでに登録されています。再度新規登録をお試しください。",
          );
          navigate("/register");
          return;

        case "UserWithUsernameExistsException":
          usernameTakenSet(true);
          return;

        case "RegistrationExpiredException":
          alert(
            "登録リンクの有効期限が切れています。再度新規登録をお試しください。",
          );
          navigate("/register");
          return;

        default:
          throw new Error(response.error);
      }
    };

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col space-y-2 justify-center items-center">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-3xl text-center sm:text-left">新規登録</h2>
        </div>

        <div class="w-full">
          <form
            class="flex flex-col space-y-2"
            autocomplete="on"
            onSubmit={onSubmitActivationForm}
          >
            <div>
              <Label for="email">メールアドレス</Label>
              <Input
                name="email"
                type="email"
                autocomplete="username"
                value={email}
                readonly
              />
            </div>

            <div>
              <Label for="screenname" class="flex justify-between">
                <span>ユーザー名</span>
                <Switch>
                  <Match when={usernameTaken() === true}>
                    <span class="text-xs text-red-500">
                      このユーザ名は使用できません
                    </span>
                  </Match>
                </Switch>
              </Label>
              <Input
                name="screenname"
                color={usernameTaken() ? "red" : "default"}
                value={rawUsername()}
                onInput={(event) => {
                  rawUsernameSet(event.currentTarget.value);
                  usernameTakenSet(false);
                }}
              />
            </div>

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
              登録を完了する
            </Button>
          </form>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
};

export default ActivatePage;
