import { Fragment, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import QRCode from 'qrcode.react'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { Square } from '@/components/atoms/Square'
import { Alert } from '@/components/styled/Alert'
import { Button } from '@/components/styled/Button'
import { Icon } from '@/components/styled/Icon'
import { Input } from '@/components/styled/Input'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import styles from './QRCode.module.sass'

export interface QRCodeStepProps {
  url: string
  onNext: () => void
  onBack: () => void
}

export const QRCodeStep = ({ url, onNext, onBack }: QRCodeStepProps) => {
  const [openModal, setOpenModal] = useState(false)

  const classes = useStyles(styles)

  return (
    <Fragment>
      <div className={classes.container}>
        <Square>
          <QRCode
            renderAs="svg"
            value={url}
            level="M"
            className={classes.qrcode}
          />
        </Square>
      </div>

      <Button color="light" onClick={() => setOpenModal(true)}>
        手動で入力する
      </Button>

      <Alert open={openModal} onConfirm={() => setOpenModal(false)}>
        <Typography variant="h1">認証コード</Typography>
        <Input
          value={url}
          readOnly
          onFocus={(event) => event.target.select()}
          suffix={
            <CopyToClipboard
              text={url}
              onCopy={() => toast('コピーしました。')}
            >
              <div className={classes.copyButton}>
                <Icon icon={faCopy} />
              </div>
            </CopyToClipboard>
          }
        />
      </Alert>

      <div className={classes.controls}>
        <Button variant="textual" color="primary" onClick={onBack}>
          戻る
        </Button>

        <Button variant="textual" color="primary" onClick={onNext}>
          次へ
        </Button>
      </div>
    </Fragment>
  )
}
