import { convertToNumber } from './utils'
import { Input } from '@/components/styled/Input'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import styles from './ValueMonitor.module.sass'

export interface ValueMonitorProps {
  value: number
  base: number
  extra: number
  onChange: (extra: number) => void
}

export const ValueMonitor = ({
  value,
  base,
  extra,
  onChange,
}: ValueMonitorProps) => {
  const classes = useStyles(styles)
  return (
    <div className={classes.container}>
      <Typography
        variant="body1"
        color={
          value < base + extra
            ? 'warning'
            : value > base + extra
            ? 'danger'
            : 'default'
        }
      >
        {value} / {base + extra}
      </Typography>

      <Typography variant="body1">+</Typography>

      <Input
        placeholder="0"
        defaultValue={extra > 0 ? extra : ''}
        className={classes.input}
        onChange={(event) => onChange(convertToNumber(event.target.value))}
      />
    </div>
  )
}
