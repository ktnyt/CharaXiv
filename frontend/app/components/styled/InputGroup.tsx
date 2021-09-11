import { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './InputGroup.module.sass'

export type InputGroupProps = {
  vertical?: boolean
  children?: React.ReactNode
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ vertical = false, children }, ref) => (
    <div
      className={clsx(
        styles.container,
        vertical ? styles.vertical : styles.horizontal,
      )}
    >
      {children}
    </div>
  ),
)

InputGroup.displayName = 'InputGroup'
