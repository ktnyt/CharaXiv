import { Fragment, useEffect, useState } from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { register } from '@/api/user'
import { Button } from '@/components/styled/Button'
import { Icon } from '@/components/styled/Icon'
import { Input, InputBorder } from '@/components/styled/Input'
import { Typography } from '@/components/styled/Typography'
import { useDebounce } from '@/hooks/useDebounce'
import { useStyles } from '@/hooks/useStyles'
import styles from './UsernameStep.module.sass'

const usernameRegexp = /^[A-Za-z0-9]{5,}$/

type Status = 'default' | 'validating' | 'error' | 'success'

const borders: Record<Status, InputBorder> = {
  default: 'none',
  validating: 'none',
  error: 'danger',
  success: 'success',
}

export interface UsernameStepProps {
  onNext: (username: string, url: string) => void
}

export const UsernameStep = ({ onNext }: UsernameStepProps) => {
  const [status, setStatus] = useState<Status>('default')
  const [rawUsername, setUsername] = useState('')
  const username = useDebounce(rawUsername, { delay: 500 })

  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleRegister = async (username: string) => {
      setStatus('validating')
      const url = await register(username).catch(() => null)
      if (url) {
        setStatus('success')
      } else {
        setStatus('error')
      }
      setStatus(url ? 'success' : 'error')
      setUrl(url)
    }

    if (username.match(usernameRegexp)) {
      handleRegister(username)
    }
  }, [username])

  const classes = useStyles(styles)

  return (
    <Fragment>
      <Input
        color="medium"
        placeholder="ユーザ名"
        value={rawUsername}
        border={borders[status]}
        onChange={(event) => {
          setStatus('default')
          setUsername(event.target.value)
        }}
        suffix={
          status === 'validating' && (
            <div className={classes.status}>
              <Icon icon={faSpinner} pulse />
            </div>
          )
        }
      />

      {status === 'error' && (
        <Typography variant="body2" color="danger">
          このユーザ名は既に使用されています。
        </Typography>
      )}

      <Typography variant="body2" color="caption">
        本サービスではパスワード認証の代わりに二段階認証を使用します。
        <a href="https://authy.com" target="_blank" rel="noopener noreferrer">
          <Typography variant="body2" color="primary">
            Authy
          </Typography>
        </a>
        などの二段階認証アプリを予めご用意ください。
      </Typography>

      <div className={classes.controls}>
        <Button variant="textual" color="primary" disabled>
          戻る
        </Button>

        <Button
          variant="textual"
          color="primary"
          disabled={status !== 'success'}
          onClick={() => url && onNext(username, url)}
        >
          次へ
        </Button>
      </div>
    </Fragment>
  )
}
