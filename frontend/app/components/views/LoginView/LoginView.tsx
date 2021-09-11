import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { setCookie } from 'nookies'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { login } from '@/api/user'
import { Icon } from '@/components/styled/Icon'
import { Input } from '@/components/styled/Input'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import { Layout } from '@/layout/Layout'
import styles from './LoginView.module.sass'

type Status = 'default' | 'validating' | 'error'

export const LoginView = () => {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [passcode, setPasscode] = useState('')
  const [status, setStatus] = useState<Status>('default')

  useEffect(() => {
    const handleLogin = async (username: string, passcode: string) => {
      setStatus('validating')
      const token = await login(username, passcode).catch(
        (error) => error.response.status,
      )
      if (typeof token === 'number') {
        setStatus('error')
      } else {
        setCookie(null, 'token', token, {
          maxAge: 60 * 60 * 24 * 14,
          path: '/',
        })
        setStatus('default')
        router.push('/')
      }
      setPasscode('')
    }

    if (username.length && passcode.match(/^\d{6}$/)) {
      handleLogin(username, passcode)
    }
  }, [username, passcode, router])

  const classes = useStyles(styles)

  return (
    <Layout>
      <div className={classes.container}>
        <div className={classes.content}>
          <Typography variant="h1">ログイン</Typography>

          <Input
            color="medium"
            placeholder="ユーザ名"
            value={username}
            border={status === 'error' ? 'danger' : 'none'}
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

          <Input
            color="medium"
            placeholder="パスコード"
            value={passcode}
            border={status === 'error' ? 'danger' : 'none'}
            onChange={(event) => {
              setStatus('default')
              setPasscode(event.target.value)
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
              ユーザ名またはパスコードが間違っています。
            </Typography>
          )}

          <Typography variant="body2" color="caption">
            初めての方はアカウントを
            <Link href="/register">
              <a>
                <Typography variant="body2" color="primary">
                  新規作成
                </Typography>
              </a>
            </Link>
          </Typography>
        </div>
      </div>
    </Layout>
  )
}
