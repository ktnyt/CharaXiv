import { callActivate, callUsernameTaken } from '@charaxiv/api/user'
import { Button } from '@charaxiv/components/Button'
import { Input } from '@charaxiv/components/Input'
import { InputBase } from '@charaxiv/components/InputBase'
import { UnauthenticatedLayout } from '@charaxiv/components/UnauthorizedLayout'
import { createDebounce } from '@charaxiv/hooks/createDebounce'
import { useNavigate, useSearchParams } from '@solidjs/router'
import clsx from 'clsx'
import { Component, createEffect, createSignal, Match, Switch } from 'solid-js'

export const ActivatePage: Component = () => {
  const navigate = useNavigate()

  const [{ registrant_address, registration_token }] = useSearchParams<{
    registrant_address?: string
    registration_token?: string
  }>()

  if (!registrant_address || !registration_token) {
    navigate('/')
    return null
  }

  const [rawUsernameKey, setRawUsernameKey] = createSignal<string>()
  const [rawUsernameTag, setRawUsernameTag] = createSignal<string>()
  const [usernameTaken, setUsernameTaken] = createSignal<boolean>()

  const usernameTagNumber = () => {
    const currentUsernameTag = rawUsernameTag()
    if (currentUsernameTag) {
      const tag = Number(currentUsernameTag)
      if (Number.isNaN(tag)) {
        return undefined
      }
      return tag
    }
    return 0
  }

  const usernameTagInvalid = () => {
    const tag = usernameTagNumber()
    return tag === undefined || tag < 0 || 9999 < tag
  }

  const debouncedUsernameKey = createDebounce(rawUsernameKey, 500)
  const debouncedUsernameTag = createDebounce(usernameTagNumber, 500)

  createEffect(async () => {
    const currentUsernameKey = debouncedUsernameKey()
    const currentUsernameTag = debouncedUsernameTag() ?? 0
    if (currentUsernameKey) {
      setUsernameTaken(undefined)
      const taken = await callUsernameTaken(
        currentUsernameKey,
        currentUsernameTag,
      )
      setUsernameTaken(taken)
    } else {
      setUsernameTaken(undefined)
    }
  })

  const [rawPassword, setRawPassword] = createSignal<string>()

  const passwordHasLower = () => /[a-z]/.test(rawPassword() ?? '')
  const passwordHasUpper = () => /[A-Z]/.test(rawPassword() ?? '')
  const passwordHasDigit = () => /[0-9]/.test(rawPassword() ?? '')
  const passwordHasOther = () =>
    /[!"#$%&\'\(\)*+,-./:;<=>?@\[\]\\^_`{|}~]/.test(rawPassword() ?? '')
  const passwordHasLength = () => (rawPassword() ?? '').length >= 10

  const passwordHasError = () =>
    !(
      passwordHasLower() &&
      passwordHasUpper() &&
      passwordHasDigit() &&
      passwordHasOther() &&
      passwordHasLength()
    )

  const formInvalid = () =>
    rawUsernameKey() === undefined ||
    rawUsernameKey() === '' ||
    usernameTaken() !== false ||
    passwordHasError() ||
    usernameTagInvalid()

  const onSubmitActivationForm = async () => {
    if (!formInvalid()) {
      const key = debouncedUsernameKey()
      const tag = debouncedUsernameTag()
      const password = rawPassword()
      if (key !== undefined && tag !== undefined && password !== undefined) {
        await callActivate(registration_token, { key, tag }, password)
        navigate('/')
      }
    }
  }

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col space-y-2 justify-center items-center">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-3xl text-center sm:text-left">新規登録</h2>
        </div>

        <div class="w-full">
          <form
            class="flex flex-col space-y-2"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmitActivationForm()
            }}
          >
            <div>
              <label for="email" class="text-sm">
                <span>メールアドレス</span>
              </label>
              <Input
                name="email"
                type="email"
                autocomplete="username"
                readonly
                value={registrant_address}
              />
            </div>

            <div>
              <label for="username" class="flex justify-between text-sm">
                <span>ユーザー名</span>
                <Switch>
                  <Match when={rawUsernameTag() && usernameTagInvalid()}>
                    <span class="text-xs text-red-500">
                      0-9999の数字のみ使用可能です
                    </span>
                  </Match>
                  <Match when={usernameTaken() === true}>
                    <span class="text-xs text-red-500">
                      このユーザ名は使用できません
                    </span>
                  </Match>
                  <Match when={usernameTaken() === false}>
                    <span class="text-xs text-green-500">
                      このユーザ名は使用できます
                    </span>
                  </Match>
                </Switch>
              </label>
              <div
                class={clsx(
                  'grid grid-cols-[1fr_35px_60px] align-middle content-center divide-x w-full rounded border transition  divide-nord-400  dark:divide-nord-600',
                  usernameTaken() === undefined &&
                    'border-nord-400 dark:border-nord-600',
                  usernameTaken() === true && 'border-red-500',
                  usernameTaken() === false && 'border-green-500',
                )}
              >
                <div>
                  <InputBase
                    class="w-full p-2 text-base leading-4 bg-nord-500 bg-opacity-0 hover:bg-opacity-10 placeholder:text-nord-500 cursor-text select-none active:outline-none focus:outline-none transition"
                    name="username"
                    value={rawUsernameKey()}
                    autocomplete="off"
                    onInput={(event) => {
                      setRawUsernameKey(event.currentTarget.value)
                      setUsernameTaken(undefined)
                    }}
                  />
                </div>
                <div class="flex h-full justify-center items-center bg-nord-500 bg-opacity-10 text-nord-400 dark:bg-nord-500 dark:bg-opcaity-10 dark:text-nord-600">
                  <span>#</span>
                </div>
                <div>
                  <InputBase
                    class="w-full p-2 text-base leading-4 bg-nord-500 bg-opacity-0 hover:bg-opacity-10 placeholder:text-nord-500 cursor-text select-none active:outline-none focus:outline-none proportional-nums transition"
                    placeholder="0000"
                    autocomplete="off"
                    onInput={(event) => {
                      setRawUsernameTag(event.currentTarget.value)
                      setUsernameTaken(undefined)
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                for="password"
                class="flex flex-col justify-between text-sm"
              >
                <span>パスワード</span>
              </label>
              <Input
                name="password"
                type="password"
                autocomplete="new-password"
                color={
                  rawPassword()
                    ? passwordHasError()
                      ? 'red'
                      : 'green'
                    : 'default'
                }
                onInput={(event) => setRawPassword(event.currentTarget.value)}
              />
              <span class="text-xs">
                <span
                  class={clsx(
                    rawPassword() && !passwordHasLower() && 'text-red-500',
                    rawPassword() && passwordHasLower() && 'text-green-500',
                  )}
                >
                  小文字
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasUpper() && 'text-red-500',
                    rawPassword() && passwordHasUpper() && 'text-green-500',
                  )}
                >
                  大文字
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasDigit() && 'text-red-500',
                    rawPassword() && passwordHasDigit() && 'text-green-500',
                  )}
                >
                  数字
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasOther() && 'text-red-500',
                    rawPassword() && passwordHasOther() && 'text-green-500',
                  )}
                >
                  記号
                </span>
                、
                <span
                  class={clsx(
                    rawPassword() && !passwordHasLength() && 'text-red-500',
                    rawPassword() && passwordHasLength() && 'text-green-500',
                  )}
                >
                  10文字以上
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
  )
}

export default ActivatePage
