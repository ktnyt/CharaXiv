import clsx from 'clsx'
import { Button, ButtonProps } from './Button'
import { Icon, IconProps } from './Icon'
import styles from './IconButton.module.sass'

export type IconButtonProps = ButtonProps & {
  icon: IconProps['icon']
  shadow?: boolean
  size?: number
  spin?: IconProps['spin']
  pulse?: IconProps['pulse']
}

export const IconButton = ({
  icon,
  shadow,
  size,
  spin,
  pulse,
  className,
  ...props
}: IconButtonProps) => (
  <Button className={clsx(className, styles['icon-button'])} {...props}>
    <Icon icon={icon} spin={spin} pulse={pulse} fixedWidth />
  </Button>
)
