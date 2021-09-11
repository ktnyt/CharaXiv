import clsx from 'clsx'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useStyles } from '@/hooks/useStyles'
import { Icon } from './Icon'
import styles from './Tag.module.sass'

export interface TagProps {
  value: string
  disabled?: boolean
  onRemove?: () => void
}

export const Tag = ({ value, disabled, onRemove }: TagProps) => {
  const classes = useStyles(styles)
  return (
    <div className={classes.container}>
      <div className={clsx(classes.label, disabled && classes.disabled)}>
        <span>{value}</span>
      </div>
      {!disabled && (
        <div className={classes.buttonWrapper}>
          <button className={classes.button} onClick={onRemove}>
            <Icon icon={faTimes} fixedWidth />
          </button>
        </div>
      )}
    </div>
  )
}
