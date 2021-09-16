import { Twemoji } from '@/components/atoms/Twemoji'
import { Typography } from '@/components/styled/Typography'
import { useStyles } from '@/hooks/useStyles'
import styles from './BaseSkillView.module.sass'
import { Status, VariableEmoji, VariableKey } from '../types'

export interface FirstAidProps {
  name: string
  base: VariableKey
  status: Status
}

export const FirstAid = ({ name, base, status }: FirstAidProps) => {
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
        {Math.ceil(status.variables[base] / 2)}
      </Typography>
    </div>
  )
}
