import { callLogin } from '@charaxiv/api/user'
import { Button } from '@charaxiv/components/Button'
import { Input } from '@charaxiv/components/Input'
import { Link } from '@charaxiv/components/Link'
import { UnauthenticatedLayout } from '@charaxiv/components/UnauthorizedLayout'
import { refetchAuthenticated } from '@charaxiv/context/authenticated'
import clsx from 'clsx'
import { Component, createSignal } from 'solid-js'

export const Login: Component = () => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')

  const formInvalid = () => email().length === 0 || password().length < 10

  const onSubmitLoginForm = async () => {
    if (!formInvalid()) {
      await callLogin(email(), password())
      await refetchAuthenticated()
    }
  }

  return (
    <UnauthenticatedLayout>
      <form
        class="flex flex-col space-y-2 justify-center items-center"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmitLoginForm()
        }}
      >
        <div class="w-full">
          <Input
            placeholder="メールアドレス"
            type="email"
            autocomplete="username"
            required
            onInput={(event) => setEmail(event.currentTarget.value)}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </div>

        <div class="w-full">
          <Input
            placeholder="パスワード"
            type="password"
            autocomplete="current-password"
            required
            onInput={(event) => setPassword(event.currentTarget.value)}
            onChange={(event) => setPassword(event.currentTarget.value)}
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
          <Link href="/password_reset" variant="textual" color="red" fullWidth>
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
  )
}
