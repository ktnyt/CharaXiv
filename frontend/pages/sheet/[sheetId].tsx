import { GetServerSideProps } from 'next'
import Error from 'next/error'
import { ParsedUrlQuery } from 'node:querystring'
import { getSheet, Sheet } from '@/api/sheet'
import { SheetView } from '@/components/views/SheetView'
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
  if (typeof sheet === 'number') {
    return <Error statusCode={sheet} />
  }
  return <SheetView sheet={sheet} />
}

export default SheetPage
