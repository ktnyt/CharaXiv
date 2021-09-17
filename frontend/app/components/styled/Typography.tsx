import { ReactNode } from 'react'
import clsx from 'clsx'
import { useStyles } from '@/hooks/useStyles'
import { ColorKey } from '@/styles/colors'
import styles from './Typography.module.sass'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'

const defaultRender: Record<TypographyVariant, TypographyRenderFunc> = {
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  body1: ({ children, ...props }) => <span {...props}>{children}</span>,
  body2: ({ children, ...props }) => <span {...props}>{children}</span>,
}

export interface TypographyRenderProps {
  className?: string
  children?: ReactNode
}

export type TypographyRenderFunc = (props: TypographyRenderProps) => JSX.Element

export type TypographyProps = {
  variant: TypographyVariant
  color?: 'default' | 'caption' | ColorKey
  className?: string
  children: ReactNode
  render?: TypographyRenderFunc
}
export const Typography = ({
  variant,
  color = 'default',
  className,
  children,
  render = defaultRender[variant],
}: TypographyProps) => {
  const classes = useStyles(styles)
  return render({
    children,
    className: clsx(
      'typography',
      className,
      classes.typography,
      classes[variant],
      classes[color],
      variant,
    ),
  })
}
