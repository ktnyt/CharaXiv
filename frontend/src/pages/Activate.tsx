import api from "@charaxiv/api";
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

  const [usernameSignal, usernameSignalSet] = createSignal<string>();
  const [usernameTakenSignal, usernameTakenSignalSet] = createSignal(false);

  const usernameSignalDebounced = createDebounce(usernameSignal, 500);

  const [passwordSignal, passwordSignalSet] = createSignal<string>();

  const passwordHasLower = () => /[a-z]/.test(passwordSignal() ?? "");
  const passwordHasUpper = () => /[A-Z]/.test(passwordSignal() ?? "");
  const passwordHasDigit = () => /[0-9]/.test(passwordSignal() ?? "");
  const passwordHasOther = () =>
    /[!"#$%&\"\(\)*+,-./:;<=>?@\[\]\\^_`{|}~]/.test(passwordSignal() ?? "");
  const passwordHasLength = () =>
    (passwordSignal() ?? "").length >= MINIMUM_PASSWORD_LENGTH;

  const passwordHasErrorSignal = () =>
    !(
      passwordHasLower() &&
      passwordHasUpper() &&
      passwordHasDigit() &&
      passwordHasOther() &&
      passwordHasLength()
    );

  const formInvalid = () =>
    usernameSignal() === undefined ||
    usernameSignal() === "" ||
    passwordHasErrorSignal();

  const onSubmitActivationForm: JSX.DOMAttributes<HTMLFormElement>["onSubmit"] =
    async (event) => {
      event.preventDefault();

      if (formInvalid()) {
        return;
      }

      const username = usernameSignalDebounced()!;
      const password = passwordSignal()!;
      try {
        await api.user.put({ token, username, password });
        navigate("/");
      } catch (e) {
        if (e instanceof api.user.RegistrationNotFoundError) {
          alert("無効な登録リンクです。再度新規登録をお試しください。");
          navigate("/register");
          return;
        }
        if (e instanceof api.user.UserWithEmailExistsError) {
          alert(
            "メールアドレスがすでに登録されています。再度新規登録をお試しください。",
          );
          navigate("/register");
          return;
        }
        if (e instanceof api.user.UserWithUsernameExistsError) {
          usernameTakenSignalSet(true);
          return;
        }
        if (e instanceof api.user.RegistrationExpiredError) {
          alert(
            "登録リンクの有効期限が切れています。再度新規登録をお試しください。",
          );
          navigate("/register");
          return;
        }
        throw e;
      }
    };

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-center text-3xl sm:text-left">新規登録</h2>
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
                  <Match when={usernameTakenSignal() === true}>
                    <span class="text-xs text-red-500">
                      このユーザ名は使用できません
                    </span>
                  </Match>
                </Switch>
              </Label>
              <Input
                name="screenname"
                color={usernameTakenSignal() ? "red" : "default"}
                value={usernameSignal()}
                onInput={(event) => {
                  usernameSignalSet(event.currentTarget.value);
                  usernameTakenSignalSet(false);
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
                  passwordSignal()
                    ? passwordHasErrorSignal()
                      ? "red"
                      : "green"
                    : "default"
                }
                onInput={(event) =>
                  passwordSignalSet(event.currentTarget.value)
                }
              />
              <span class="text-xs">
                <span
                  class={clsx(
                    passwordSignal() && !passwordHasLower() && "text-red-500",
                    passwordSignal() && passwordHasLower() && "text-green-500",
                  )}
                >
                  小文字
                </span>
                、
                <span
                  class={clsx(
                    passwordSignal() && !passwordHasUpper() && "text-red-500",
                    passwordSignal() && passwordHasUpper() && "text-green-500",
                  )}
                >
                  大文字
                </span>
                、
                <span
                  class={clsx(
                    passwordSignal() && !passwordHasDigit() && "text-red-500",
                    passwordSignal() && passwordHasDigit() && "text-green-500",
                  )}
                >
                  数字
                </span>
                、
                <span
                  class={clsx(
                    passwordSignal() && !passwordHasOther() && "text-red-500",
                    passwordSignal() && passwordHasOther() && "text-green-500",
                  )}
                >
                  記号
                </span>
                、
                <span
                  class={clsx(
                    passwordSignal() && !passwordHasLength() && "text-red-500",
                    passwordSignal() && passwordHasLength() && "text-green-500",
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
