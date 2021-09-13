import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/dist/client/router'
import { setCookie } from 'nookies'
import { faSpinner, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { createSheet, deleteSheet, Sheet } from '@/api/sheet'
import { setUserSystem } from '@/api/user'
import { IconButton } from '@/components/styled/IconButton'
import { InputGroup } from '@/components/styled/InputGroup'
import { Option, Select } from '@/components/styled/Select'
import { useAppData } from '@/context/AppDataContext'
import { useCookie } from '@/context/CookiesContext'
import { remover } from '@/helpers/array'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStyles } from '@/hooks/useStyles'
import { Header } from '@/layout/Header'
import { Layout } from '@/layout/Layout'
import { Main } from '@/layout/Main'
import { SheetCard } from './SheetCard'
import styles from './SheetList.module.sass'

export interface SheetListViewProps {
  sheets: Sheet[]
}

export const SheetListView = ({ sheets: init }: SheetListViewProps) => {
  const [sheets, setSheets] = useState(init)

  const isMounted = useIsMounted()
  const router = useRouter()

  const { systems } = useAppData()

  const [system, setSystem] = useLocalStorage<Option>('system', systems[0])
  const handleSystem = (option: Option) => {
    if (isMounted()) {
      setSystem(option)
    }
  }

  const token = useCookie('token')

  useEffect(() => {
    if (token) {
      setUserSystem(system.value, token)
      setCookie(null, 'system', system.value, {
        maxAge: 60 * 60 * 24 * 14,
        path: '/',
      })
    }
  }, [system, token])

  const [creating, setCreating] = useState(false)
  const handleCreate = async () => {
    if (token) {
      setCreating(true)
      const sheetId = await createSheet(system.value, token).catch(() => null)
      if (isMounted()) {
        if (sheetId === null) {
          setCreating(false)
          toast.error('キャラクターの作成に失敗しました。', {
            duration: 2000,
            position: 'top-center',
          })
        } else {
          router.push(`/sheet/${sheetId}`)
        }
      }
    }
  }

  const classes = useStyles(styles)

  return (
    <Layout>
      <Header>
        <InputGroup>
          {token && (
            <Fragment>
              <Select
                options={systems}
                defaultValue={system}
                onChange={(option) => handleSystem(option)}
              />

              <IconButton
                variant="default"
                color="primary"
                icon={creating ? faSpinner : faUserPlus}
                pulse={creating}
                disabled={creating}
                onClick={handleCreate}
              />
            </Fragment>
          )}
        </InputGroup>
      </Header>

      <Main>
        <div className={classes.container}>
          {sheets.map((sheet, index) => (
            <div
              key={sheet.id}
              onClick={() => router.push(`/sheet/${sheet.id}`)}
            >
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
      </Main>
    </Layout>
  )
}
