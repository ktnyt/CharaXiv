import { useState } from 'react'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import { Header } from '@/layout/Header'
import { Layout } from '@/layout/Layout'
import { Main } from '@/layout/Main'
import { PasscodeStep } from './PasscodeStep'
import { QRCodeStep } from './QRCodeStep'
import { UsernameStep } from './UsernameStep'
import styles from './RegisterView.module.sass'

type Step = 'username' | 'qrcode' | 'passcode'

export const RegisterView = () => {
  const [username, setUsername] = useState('')
  const [step, setStep] = useState<Step>('username')
  const [url, setUrl] = useState('')

  const classes = useStyles(styles)

  return (
    <Layout>
      <Header />

      <Main>
        <div className={classes.container}>
          <div className={classes.content}>
            <Typography variant="h1">新規登録</Typography>

            {step === 'username' && (
              <UsernameStep
                onNext={(username, url) => {
                  setUsername(username)
                  setUrl(url)
                  setStep('qrcode')
                }}
              />
            )}

            {step === 'qrcode' && (
              <QRCodeStep
                url={url}
                onBack={() => setStep('username')}
                onNext={() => setStep('passcode')}
              />
            )}

            {step === 'passcode' && (
              <PasscodeStep
                username={username}
                onBack={() => setStep('qrcode')}
              />
            )}
          </div>
        </div>
      </Main>
    </Layout>
  )
}
