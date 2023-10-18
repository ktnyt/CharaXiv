import { UnauthenticatedLayout } from "@charaxiv/components/UnauthorizedLayout";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { Component } from "solid-js";

export const RegisterSentPage: Component = () => {
  const navigate = useNavigate();

  const [{ email }] = useSearchParams<{
    email?: string;
  }>();

  if (!email) {
    navigate("/register");
    return null;
  }

  return (
    <UnauthenticatedLayout>
      <div class="flex flex-col items-center justify-center space-y-2">
        <div class="w-full pt-2 pb-4">
          <h2 class="text-center text-3xl sm:text-left">登録受付完了</h2>
        </div>

        <div class="w-full space-y-2 pb-4">
          <p class="text-md">
            <span class="font-bold">{email}</span>{" "}
            宛にユーザ登録用メールが送信されました。
          </p>
          <p class="text-justify text-sm">
            メールに記載された手順に従って、ユーザ登録を完了してください。
          </p>
          <p class="text-justify text-sm">
            もしメールが届かなかった場合は迷惑メールフォルダやフィルターの設定等をご確認いただき、お手数ですが再度登録手続きをお願いいたします。
          </p>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
};

export default RegisterSentPage;
