import { maxVariableKey } from './utils'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Twemoji } from '@/components/atoms/Twemoji'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { range } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import styles from './SingleSkillView.module.sass'
import { SingleSkill, Status, VariableEmoji } from '../types'

export interface SingleSkillViewProps {
  skill: SingleSkill
  status: Status
  disabled?: boolean
  hideInit?: boolean
  onChange: (skill: SingleSkill) => void
}

export const SingleSkillView = ({
  skill,
  status,
  disabled,
  hideInit,
  onChange,
}: SingleSkillViewProps) => {
  const skillRef = useRef(skill)

  useEffect(() => {
    skillRef.current = skill
  }, [skill])

  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const key = maxVariableKey(status, skill.base)
  const [level, setLevel] = useState(skill.level)

  useEffect(() => {
    onChangeRef.current({ ...skillRef.current, level })
  }, [level])

  const classes = useStyles(styles)

  return !hideInit || skill.level > 0 ? (
    <div className={clsx('single-skill', classes.container)}>
      <Typography variant="body1">{skill.name}</Typography>

      <SlideSelector
        defaultIndex={skill.level}
        disabled={disabled}
        onCommit={setLevel}
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
        color={skill.level ? 'default' : 'caption'}
        className="bold"
      >
        {status.variables[key] + skill.level}
      </Typography>
    </div>
  ) : null
}
