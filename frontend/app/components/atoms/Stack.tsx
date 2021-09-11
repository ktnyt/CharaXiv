import { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Stack.module.sass'

export interface StackProps {
  className?: string
  children?: ReactNode
}

export const Stack = ({ className, children }: StackProps) => (
  <div className={clsx(className, styles.stack)}>{children}</div>
)
