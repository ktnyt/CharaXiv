import { useRef } from 'react'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@/components/styled/Icon'
import { useSize } from '@/hooks/useSize'
import { useStyles } from '@/hooks/useStyles'
import styles from './ImagePlaceholder.module.sass'
import { Square } from '../atoms/Square'

export const ImagePlaceholder = () => {
  const ref = useRef<HTMLDivElement>(null!)

  const size = useSize(ref)

  const classes = useStyles(styles)

  return (
    <Square
      ref={ref}
      className={classes.container}
      style={{ fontSize: size.width / 2 }}
    >
      <Icon icon={faUser} fixedWidth />
    </Square>
  )
}
