import { Fragment } from 'react'
import Head from 'next/head'
import { LoginView } from '@/components/views/LoginView/LoginView'

const Login = () => (
  <Fragment>
    <Head>
      <title>ログイン | CharaXiv</title>
    </Head>
    <LoginView />
  </Fragment>
)

export default Login
