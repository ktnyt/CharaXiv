import { maxVariableKey } from './utils'
import { Dispatch } from 'react'
import clsx from 'clsx'
import { Twemoji } from '@/components/atoms/Twemoji'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { range } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import { SkillsAction } from './SkillsReducer'
import styles from './SingleSkillView.module.sass'
import { SingleSkill, Status, VariableEmoji } from '../types'

export interface ReviveProps {
  skill: SingleSkill
  status: Status
  disabled?: boolean
  hideInit?: boolean
  dispatch: Dispatch<SkillsAction>
}

export const Revive = ({
  skill: { name, base, bases, level },
  status,
  disabled,
  hideInit,
  dispatch,
}: ReviveProps) => {
  const key = base || maxVariableKey(status, bases)

  const classes = useStyles(styles)

  return !hideInit || level > 0 ? (
    <div className={clsx('single-skill', classes.container)}>
      <Typography variant="body1">{name}</Typography>

      <SlideSelector
        defaultIndex={level}
        disabled={disabled}
        onCommit={(level) => dispatch({ type: 'skill-level', name, level })}
      >
        {range(0, 3).map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </SlideSelector>

      <Typography variant="body1">
        <Twemoji emoji={VariableEmoji[key]} />
      </Typography>

      <Typography
        variant="body1"
        color={level ? 'default' : 'caption'}
        className="bold"
      >
        {Math.ceil(status.variables[key] / 2)}
      </Typography>
    </div>
  ) : null
}
