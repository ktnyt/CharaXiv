import { Fragment } from 'react'
import type { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import nookies from 'nookies'
import { AppData, getAppData } from '@/api/app_data'
import { AppDataContext } from '@/context/AppDataContext'
import { CookiesContext } from '@/context/CookiesContext'
import '../styles/index.css'

type AppComponentProps = AppProps & {
  cookies: Record<string, string>
  appData: AppData
}

function MyApp({ Component, pageProps, cookies, appData }: AppComponentProps) {
  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width"
        />
      </Head>
      <AppDataContext.Provider value={appData}>
        <CookiesContext.Provider value={cookies}>
          <Component {...pageProps} />
        </CookiesContext.Provider>
      </AppDataContext.Provider>
    </Fragment>
  )
}

MyApp.getInitialProps = async (app: AppContext) => {
  const cookies = nookies.get(app.ctx)

  const appData = await getAppData()
  if (typeof appData === 'number') {
    return { isError: true }
  }

  return { cookies, appData }
}

export default MyApp
