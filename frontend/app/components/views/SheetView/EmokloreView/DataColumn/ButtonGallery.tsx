import { Fragment } from 'react'
import { Button, ButtonProps } from '@/components/styled/Button'

const Variants: NonNullable<ButtonProps['variant']>[] = [
  'default',
  'outline',
  'textual',
]

const Colors: NonNullable<ButtonProps['color']>[] = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'light',
  'medium',
  'dark',
]

export const ButtonGallery = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
      }}
    >
      {Colors.map((color) => (
        <Fragment key={color}>
          {Variants.map((variant) => (
            <Button key={variant} variant={variant} color={color}>
              {variant}
            </Button>
          ))}
          {Variants.map((variant) => (
            <Button key={variant} variant={variant} color={color} disabled>
              {variant}
            </Button>
          ))}
        </Fragment>
      ))}
    </div>
  )
}
