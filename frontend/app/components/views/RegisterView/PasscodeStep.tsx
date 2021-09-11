import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { setCookie } from 'nookies'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { verify } from '@/api/user'
import { Button } from '@/components/styled/Button'
import { Icon } from '@/components/styled/Icon'
import { Input } from '@/components/styled/Input'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import styles from './PasscodeStep.module.sass'

export type Status = 'default' | 'validating' | 'error'

export interface PasscodeStepProps {
  username: string
  onBack: () => void
}

export const PasscodeStep = ({ username, onBack }: PasscodeStepProps) => {
  const router = useRouter()

  const [status, setStatus] = useState<Status>('default')
  const [passcode, setPasscode] = useState('')

  useEffect(() => {
    const handleVerify = async (username: string, passcode: string) => {
      setStatus('validating')
      const token = await verify(username, passcode).catch(
        (error) => error.response.status,
      )
      if (typeof token === 'number') {
        setStatus('error')
      } else {
        setCookie(null, 'token', token, {
          maxAge: 60 * 60 * 24 * 14,
          path: '/',
        })
        router.push('/')
      }
      setPasscode('')
    }

    if (passcode.match(/^\d{6}$/)) {
      handleVerify(username, passcode)
    }
  }, [username, passcode, router])

  const classes = useStyles(styles)

  return (
    <Fragment>
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
        disabled={status === 'validating'}
      />

      {status === 'error' && (
        <Typography variant="body2" color="danger">
          パスコードが間違っています。
        </Typography>
      )}

      <div className={classes.controls}>
        <Button
          variant="textual"
          color="primary"
          onClick={onBack}
          disabled={status === 'validating'}
        >
          戻る
        </Button>
      </div>
    </Fragment>
  )
}
