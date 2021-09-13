import { ComponentPropsWithRef, forwardRef } from 'react'
import clsx from 'clsx'
import { useStyles } from '@/hooks/useStyles'
import styles from './EmotionButton.module.sass'
import { EmotionType, getEmotionCategory } from '../types'

export type EmotionButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children'
> & {
  prefix?: string
  emotion?: EmotionType
  variant?: 'default' | 'outline' | 'lighten'
}

export const EmotionButton = forwardRef<HTMLButtonElement, EmotionButtonProps>(
  ({ prefix, emotion, variant, className, ...props }, ref) => {
    const classes = useStyles(styles)
    const category = emotion ? getEmotionCategory(emotion) : undefined
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          classes.button,
          category && classes[category],
          variant && classes[variant],
        )}
        {...props}
      >
        <span>
          {prefix}
          {emotion ? emotion : '未設定'}
        </span>
      </button>
    )
  },
)

EmotionButton.displayName = 'EmotionButton'
