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
import { EXSkills, SingleSkill, Status, VariableEmoji } from '../types'

export interface SingleSkillViewProps {
  skill: SingleSkill
  status: Status
  disabled?: boolean
  hideInit?: boolean
  dispatch: Dispatch<SkillsAction>
}

export const SingleSkillView = ({
  skill: { name, base, bases, level },
  status,
  disabled,
  hideInit,
  dispatch,
}: SingleSkillViewProps) => {
  const key = base || maxVariableKey(status, bases)

  const classes = useStyles(styles)

  return !hideInit || level > 0 ? (
    <div className={clsx('single-skill', classes.container)}>
      <Typography variant="body1">
        {EXSkills.includes(name) ? `★${name}` : name}
      </Typography>

      <SlideSelector
        defaultIndex={level}
        disabled={disabled}
        onCommit={(level) => dispatch({ type: 'skill-level', name, level })}
      >
        {range(0, 3).map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </SlideSelector>

      <SlideSelector
        flat
        index={bases.indexOf(key)}
        onCommit={(index) =>
          dispatch({ type: 'skill-base', name, base: bases[index] })
        }
      >
        {bases.map((base) => (
          <Twemoji key={base} emoji={VariableEmoji[base]} />
        ))}
      </SlideSelector>

      <Typography
        variant="body1"
        color={level ? 'default' : 'caption'}
        className="bold"
      >
        {status.variables[key] + level}
      </Typography>
    </div>
  ) : null
}
