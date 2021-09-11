import { ReactNode } from 'react'
import { useStyles } from '@/hooks/useStyles'
import { ColorKey } from '@/styles/colors'
import { Button } from './Button'
import { InputGroup } from './InputGroup'
import { Modal } from './Modal'
import styles from './Confirm.module.sass'

export interface ConfirmProps {
  open: boolean
  confirm?: string
  confirmColor?: ColorKey
  cancel?: string
  cancelColor?: ColorKey
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export const Confirm = ({
  open,
  confirm = 'OK',
  confirmColor = 'primary',
  cancel = 'キャンセル',
  cancelColor = 'danger',
  onConfirm,
  onCancel,
  children,
}: ConfirmProps) => {
  const classes = useStyles(styles)
  return (
    <Modal open={open} handleClose={onCancel}>
      <div className={classes.container}>
        <div className={classes.message}>
          <div>{children}</div>
        </div>

        <div>
          <div>
            <InputGroup>
              <Button variant="textual" color={cancelColor} onClick={onCancel}>
                {cancel}
              </Button>
              <Button
                variant="textual"
                color={confirmColor}
                onClick={onConfirm}
              >
                {confirm}
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </Modal>
  )
}
