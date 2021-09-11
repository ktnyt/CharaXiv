import { ComponentPropsWithRef, forwardRef } from 'react'
import styles from './Square.module.sass'

export type SquareProps = ComponentPropsWithRef<'div'>

export const Square = forwardRef<HTMLDivElement, SquareProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={styles.square} {...props}>
      <div className={className}>{children}</div>
    </div>
  ),
)

Square.displayName = 'Square'
