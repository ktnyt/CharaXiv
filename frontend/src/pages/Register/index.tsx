import { Button } from '@charaxiv/components/Button'
import { Input } from '@charaxiv/components/Input'
import { Component, createEffect, createSignal, Show } from 'solid-js'
import * as EmailValidator from 'email-validator'
import { callRegister } from '@charaxiv/api/user'
import { useNavigate } from '@solidjs/router'
import { UnauthenticatedLayout } from '@charaxiv/components/UnauthorizedLayout'

export const RegisterPage: Component = () => {
  const navigate = useNavigate()

  const [email, setEmail] = createSignal<string>()
  const [emailFocus, setEmailFocus] = createSignal(false)

  const formInvalid = () => !EmailValidator.validate(email() ?? '')

  const showEmailError = () => {
    const currentEmail = email()
    return (
      !emailFocus() &&
      currentEmail !== undefined &&
      !EmailValidator.validate(currentEmail)
    )
  }

  const onSubmitRegistrationForm = async () => {
    const registrantAddress = email()
    if (registrantAddress && !formInvalid()) {
      await callRegister(registrantAddress)
      navigate(
        `/register_sent?registrant_address=${encodeURIComponent(
          registrantAddress,
        )}`,
      )
    }
  }

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
              event.preventDefault()
              onSubmitRegistrationForm()
            }}
          >
            <div>
              <label for="email" class="flex flex-row justify-between text-sm">
                <span>メールアドレス</span>
                <Show when={showEmailError()}>
                  <span class="text-xs text-red-500"> 値が不正です</span>
                </Show>
              </label>
              <Input
                name="email"
                type="email"
                autocomplete="username"
                required
                color={showEmailError() ? 'red' : 'default'}
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
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
  )
}

export default RegisterPage
