import clsx from 'clsx'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useStyles } from '@/hooks/useStyles'
import { Icon } from './Icon'
import styles from './Tag.module.sass'

export interface TagProps {
  value: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  onRemove?: () => void
}

export const Tag = ({
  value,
  selected,
  disabled,
  onClick,
  onRemove,
}: TagProps) => {
  const classes = useStyles(styles)
  return (
    <div
      className={clsx(
        classes.container,
        !disabled && selected && classes.selected,
      )}
      onClick={onClick}
    >
      <div className={clsx(classes.label, disabled && classes.disabled)}>
        <span>{value}</span>
      </div>
      {!disabled && (
        <div className={classes.buttonWrapper}>
          <button
            className={clsx(
              classes.button,
              !disabled && selected && classes.selected,
            )}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (onRemove) {
                onRemove()
              }
            }}
          >
            <Icon icon={faTimes} fixedWidth />
          </button>
        </div>
      )}
    </div>
  )
}
