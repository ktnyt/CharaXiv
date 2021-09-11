import { forwardRef, ReactNode } from 'react'
import clsx from 'clsx'
import { kebab } from '@/helpers/case_conversion'
import { useStyles } from '@/hooks/useStyles'
import { ColorKey } from '@/styles/colors'
import { InputSet } from './InputSet'
import { TypographyVariant } from './Typography'
import styles from './Input.module.sass'
import { BaseInput, BaseInputProps } from '../atoms/BaseInput'

export type InputBorder = 'none' | 'light' | 'medium' | 'dark' | ColorKey

export type InputProps = BaseInputProps & {
  variant?: TypographyVariant
  color?: 'light' | 'medium' | 'dark'
  border?: InputBorder
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'body1',
      color = 'light',
      border = 'none',
      suffix,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = useStyles(styles)

    return (
      <InputSet
        className={clsx(
          className,
          classes.container,
          classes[variant],
          classes[color],
          border && classes[kebab.toCamel(`border-${border}`)],
        )}
      >
        <BaseInput
          ref={ref}
          className={clsx(className, classes.input)}
          {...props}
        />
        {suffix && <div>{suffix}</div>}
      </InputSet>
    )
  },
)

Input.displayName = 'Input'
