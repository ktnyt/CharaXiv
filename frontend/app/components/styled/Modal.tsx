import { ReactNode, useEffect, useRef } from 'react'
import { useStyles } from '@/hooks/useStyles'
import styles from './Modal.module.sass'

export type ModalProps = {
  open: boolean
  handleClose?: () => void
  children?: ReactNode
}

export const Modal = ({ open, handleClose, children }: ModalProps) => {
  const handleCloseRef = useRef(handleClose)

  useEffect(() => {
    handleCloseRef.current = handleClose
  }, [handleClose])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && handleCloseRef.current) {
        handleCloseRef.current()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const classes = useStyles(styles)

  return open ? (
    <div className={classes.container} onClick={handleClose}>
      <div>
        <div onClick={(event) => event.stopPropagation()}>{children}</div>
      </div>
    </div>
  ) : null
}
