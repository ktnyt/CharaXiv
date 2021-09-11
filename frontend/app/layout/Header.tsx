import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { setCookie } from 'nookies'
import {
  faLayerGroup,
  faMoon,
  faSpinner,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { createSheet } from '@/api/sheet'
import { setUserSystem } from '@/api/user'
import { Icon } from '@/components/styled/Icon'
import { IconButton } from '@/components/styled/IconButton'
import { InputGroup } from '@/components/styled/InputGroup'
import { Option, Select } from '@/components/styled/Select'
import { Typography } from '@/components/styled/Typography'
import { useAppData } from '@/context/AppDataContext'
import { useCookie } from '@/context/CookiesContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStyles } from '@/hooks/useStyles'
import styles from './Header.module.sass'

export const Header = () => {
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

  const [, toggleScheme] = useColorScheme()
  const classes = useStyles(styles)

  return (
    <header className={classes.header}>
      <div>
        <Link href="/">
          <a className={classes.title}>
            <Icon icon={faLayerGroup} color="default" />
            <Typography variant="h2" color="default">
              CharaXiv
            </Typography>
          </a>
        </Link>
      </div>
      <div className={classes.controls}>
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

          <IconButton
            variant="textual"
            color="medium"
            icon={faMoon}
            onClick={() => isMounted() && toggleScheme()}
          />
        </InputGroup>
      </div>
    </header>
  )
}
