import clsx from 'clsx'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'
import { useStyles } from '@/hooks/useStyles'
import { ColorKey } from '@/styles/colors'
import styles from './Icon.module.sass'

export type IconProps = FontAwesomeIconProps & {
  color?: ColorKey | 'default' | 'light' | 'medium' | 'dark'
}

export const Icon = ({ color, className, ...props }: IconProps) => {
  const classes = useStyles(styles)
  return (
    <FontAwesomeIcon
      className={clsx(className, color && classes[color])}
      {...props}
    />
  )
}
