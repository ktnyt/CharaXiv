import { Fragment } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import Error from 'next/error'
import Head from 'next/head'
import { ParsedUrlQuery } from 'node:querystring'
import { getSheet, Sheet } from '@/api/sheet'
import { SheetView } from '@/components/views/SheetView'
import { useAppData } from '@/context/AppDataContext'
import { imageUrl } from '@/helpers/image_url'
import { handleServerCookies } from '@/server_cookies'

interface Props {
  sheet: Sheet | number
}

interface Query extends ParsedUrlQuery {
  sheetId: string
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (
  ctx,
) => {
  const token = await handleServerCookies(ctx)

  if (!ctx.params) {
    return { props: { sheet: 405 } }
  }

  const { sheetId } = ctx.params
  const sheet = await getSheet(sheetId, token).catch(
    (error) => error.response.status,
  )
  return { props: { sheet } }
}

const SheetPage = ({ sheet }: Props) => {
  const { asPath: url } = useRouter()

  const { systems } = useAppData()

  if (typeof sheet === 'number') {
    return <Error statusCode={sheet} />
  }

  const systemNames = Object.fromEntries(
    systems.map(({ value, label }) => [value, label]),
  )

  const name = sheet.name === '' ? '名無しさん' : sheet.name
  const title = `${name} | ${systemNames[sheet.system]}`

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta property="og:site_name" content="CharaXiv" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={imageUrl(sheet.images[0])} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <SheetView sheet={sheet} />
    </Fragment>
  )
}

export default SheetPage
