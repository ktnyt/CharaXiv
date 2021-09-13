import { ComponentPropsWithRef, forwardRef } from 'react'
import clsx from 'clsx'
import { useStyles } from '@/hooks/useStyles'
import { ColorKey } from '@/styles/colors'
import styles from './Button.module.sass'

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'default' | 'outline' | 'textual'
  color?: ColorKey | 'light' | 'medium' | 'dark'
  fullWidth?: boolean
  shadow?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      color = 'medium',
      fullWidth = false,
      shadow = false,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = useStyles(styles)
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          classes.button,
          classes[variant],
          classes[color],
          fullWidth && classes.fullWidth,
          shadow && classes.shadow,
        )}
        {...props}
      >
        <div>{children}</div>
      </button>
    )
  },
)

Button.displayName = 'Button'
