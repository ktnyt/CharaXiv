import { UnauthenticatedLayout } from '@charaxiv/components/UnauthorizedLayout'
import { CHARAXIV_FQDN } from '@charaxiv/constants'
import { useNavigate, useSearchParams } from '@solidjs/router'
import { Component } from 'solid-js'

export const RegisterSentPage: Component = () => {
  const navigate = useNavigate()

  const [{ registrant_address }] = useSearchParams<{
    registrant_address?: string
  }>()

  if (!registrant_address) {
    navigate('/register')
    return null
  }

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col space-y-2 justify-center items-center">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-3xl text-center sm:text-left">登録受付完了</h2>
        </div>

        <div class="w-full pb-4 space-y-2">
          <p class="text-md">
            <span class="font-bold">{registrant_address}</span>{' '}
            宛にユーザ登録用メールが送信されました。
          </p>
          <p class="text-sm text-justify">
            メールに記載された手順に従って、ユーザ登録を完了してください。
          </p>
          <p class="text-sm text-justify">
            もしメールが届かなかった場合は迷惑メールフォルダやフィルターの設定等をご確認いただき、お手数ですが再度登録手続きをお願いいたします。
          </p>
        </div>
      </div>
    </UnauthenticatedLayout>
  )
}

export default RegisterSentPage
