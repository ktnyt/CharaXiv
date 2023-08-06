import { callLogin } from "@charaxiv/api/user";
import { Button } from "@charaxiv/components/Button";
import { Input } from "@charaxiv/components/Input";
import { Label } from "@charaxiv/components/Label";
import { Link } from "@charaxiv/components/Link";
import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { refetchAuthenticated } from "@charaxiv/context/authenticated";
import { Component, createSignal } from "solid-js";

export const Login: Component = () => {
  const [email, emailSet] = createSignal("");
  const [password, passwordSet] = createSignal("");

  const formInvalid = () => email().length === 0 || password().length < 12;

  const onSubmitLoginForm = async () => {
    if (!formInvalid()) {
      await callLogin(email(), password());
      await refetchAuthenticated();
    }
  };

  return (
    <UnauthenticatedLayout>
      <form
        class="flex flex-col space-y-2 justify-center items-center"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitLoginForm();
        }}
      >
        <div class="w-full">
          <Label for="email">メールアドレス</Label>
          <Input
            name="email"
            type="email"
            autocomplete="username"
            required
            onInput={(event) => emailSet(event.currentTarget.value)}
            onChange={(event) => emailSet(event.currentTarget.value)}
          />
        </div>

        <div class="w-full">
          <Label for="password">パスワード</Label>
          <Input
            name="password"
            type="password"
            autocomplete="current-password"
            required
            onInput={(event) => passwordSet(event.currentTarget.value)}
            onChange={(event) => passwordSet(event.currentTarget.value)}
          />
        </div>

        <div class="w-full">
          <Button
            variant="default"
            color="green"
            type="submit"
            fullWidth
            disabled={formInvalid()}
          >
            ログイン
          </Button>
        </div>

        <div class="w-full">
          <Link
            href="/password_reset_request"
            variant="textual"
            color="red"
            fullWidth
          >
            パスワードを忘れた
          </Link>
        </div>
      </form>

      <hr class="border-nord-300 dark:border-nord-700" />

      <div class="w-full">
        <Link href="/register" variant="outline" color="blue" fullWidth>
          新規登録
        </Link>
      </div>
    </UnauthenticatedLayout>
  );
};
