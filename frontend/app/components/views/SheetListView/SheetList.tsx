import { useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { deleteSheet, Sheet } from '@/api/sheet'
import { useCookie } from '@/context/CookiesContext'
import { remover } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import { Layout } from '@/layout/Layout'
import { SheetCard } from './SheetCard'
import styles from './SheetList.module.sass'

export interface SheetListViewProps {
  sheets: Sheet[]
}

export const SheetListView = ({ sheets: init }: SheetListViewProps) => {
  const [sheets, setSheets] = useState(init)

  const token = useCookie('token')

  const router = useRouter()
  const classes = useStyles(styles)

  return (
    <Layout>
      <div className={classes.container}>
        {sheets.map((sheet, index) => (
          <div key={sheet.id} onClick={() => router.push(`/sheet/${sheet.id}`)}>
            <SheetCard
              sheet={sheet}
              onRemove={async () => {
                if (token) {
                  await deleteSheet(sheet.id, token)
                  setSheets(remover(index))
                }
              }}
            />
          </div>
        ))}
      </div>
    </Layout>
  )
}
