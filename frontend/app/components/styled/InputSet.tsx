import { forwardRef } from 'react'
import clsx from 'clsx'
import { useStyles } from '@/hooks/useStyles'
import styles from './InputSet.module.sass'

export type InputSetProps = {
  vertical?: boolean
  className?: string
  children?: React.ReactNode
}

export const InputSet = forwardRef<HTMLDivElement, InputSetProps>(
  ({ vertical = false, className, children }, ref) => {
    const classes = useStyles(styles)
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          classes.container,
          vertical && classes.vertical,
        )}
      >
        {children}
      </div>
    )
  },
)

InputSet.displayName = 'InputSet'
