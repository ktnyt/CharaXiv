import { Fragment } from 'react'
import Head from 'next/head'
import { RegisterView } from '@/components/views/RegisterView/RegisterView'

const Register = () => (
  <Fragment>
    <Head>
      <title>新規登録 | CharaXiv</title>
    </Head>
    <RegisterView />
  </Fragment>
)

export default Register
