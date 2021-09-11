import { forwardRef } from 'react'
import clsx from 'clsx'
import { useStyles } from '@/hooks/useStyles'
import styles from './TextArea.module.sass'
import { BaseTextArea, BaseTextAreaProps } from '../atoms/BaseTextArea'

export type TextAreaProps = BaseTextAreaProps & {
  fixed?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ color, fixed, className, disabled, ...props }, ref) => {
    const classes = useStyles(styles)
    return (
      <BaseTextArea
        ref={ref}
        className={clsx(className, classes.textarea)}
        disabled={disabled || fixed}
        {...props}
      />
    )
  },
)

TextArea.displayName = 'TextArea'
