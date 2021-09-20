import { Fragment } from 'react'
import type { GetServerSideProps } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { ParsedUrlQuery } from 'node:querystring'
import { listSheets, Sheet } from '@/api/sheet'
import { getUserSystem } from '@/api/user'
import { SheetListView } from '@/components/views/SheetListView'
import { handleServerCookies } from '@/server_cookies'

interface Props {
  sheets: Sheet[] | number
}

interface Query extends ParsedUrlQuery {
  page: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (
  ctx,
) => {
  const token = await handleServerCookies(ctx)

  if (!token) {
    return { redirect: { destination: '/login', permanent: false } }
  }

  const system = await getUserSystem(token)
  if (typeof system === 'number') {
    return { props: { sheets: system } }
  }

  const sheets = await listSheets(system, token).catch(
    (error) => error.response.status,
  )
  return { props: { sheets } }
}

const Home = ({ sheets }: Props) => {
  if (typeof sheets === 'number') {
    return <Error statusCode={sheets} />
  }

  return (
    <Fragment>
      <Head>
        <title>ホーム | CharaXiv</title>
      </Head>
      <SheetListView sheets={sheets} />
    </Fragment>
  )
}

export default Home
