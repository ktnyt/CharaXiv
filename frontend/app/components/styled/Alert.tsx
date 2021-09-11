import { CSSProperties, ReactNode } from 'react'
import { useStyles } from '@/hooks/useStyles'
import { ColorKey } from '@/styles/colors'
import { Button } from './Button'
import { Modal } from './Modal'
import styles from './Alert.module.sass'

export interface AlertProps {
  open: boolean
  justifyContent?: CSSProperties['justifyContent']
  confirm?: string
  color?: ColorKey
  onConfirm: () => void
  children?: ReactNode
}

export const Alert = ({
  open,
  confirm = 'OK',
  color = 'primary',
  onConfirm,
  children,
}: AlertProps) => {
  const classes = useStyles(styles)
  return (
    <Modal open={open} handleClose={onConfirm}>
      <div className={classes.container}>
        <div>{children}</div>

        <div>
          <Button variant="textual" color={color} onClick={onConfirm}>
            {confirm}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
