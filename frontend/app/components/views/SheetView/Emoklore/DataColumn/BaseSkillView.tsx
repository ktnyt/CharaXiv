import { Status, VariableEmoji, VariableKey } from './types'
import { Twemoji } from '@/components/atoms/Twemoji'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import styles from './BaseSkillView.module.sass'

export interface BaseSkillViewProps {
  name: string
  base: VariableKey
  status: Status
}

export const BaseSkillView = ({ name, base, status }: BaseSkillViewProps) => {
  const classes = useStyles(styles)
  return (
    <div className={classes.container}>
      <Typography variant="body1" className="bold">
        {name}
      </Typography>

      <Typography variant="body1">
        <Twemoji emoji={VariableEmoji[base]} />
      </Typography>

      <Typography variant="body1" className="bold">
        {status.variables[base]}
      </Typography>
    </div>
  )
}
