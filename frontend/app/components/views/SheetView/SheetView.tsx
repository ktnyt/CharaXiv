import { Fragment } from 'react'
import { useRouter } from 'next/dist/client/router'
import Error from 'next/error'
import Head from 'next/head'
import { Sheet } from '@/api/sheet'
import { useAppData } from '@/context/AppDataContext'
import { imageUrl } from '@/helpers/image_url'
import { Header } from '@/layout/Header'
import { Layout } from '@/layout/Layout'
import { Main } from '@/layout/Main'
import { Emoklore } from './Emoklore'

export interface SheetViewProps {
  sheet: Sheet
}

export const SheetView = ({ sheet }: SheetViewProps) => {
  const { asPath: url } = useRouter()

  const { systems } = useAppData()
  const systemNames = Object.fromEntries(
    systems.map(({ value, label }) => [value, label]),
  )

  const name = sheet.name === '' ? '名無しさん' : sheet.name
  const title = `${name} | ${systemNames[sheet.system]}`

  switch (sheet.system) {
    case 'emoklore':
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

          <Layout>
            <Header></Header>

            <Main>
              <Emoklore sheet={sheet} />
            </Main>
          </Layout>
        </Fragment>
      )

    default:
      return <Error statusCode={404} />
  }
}
