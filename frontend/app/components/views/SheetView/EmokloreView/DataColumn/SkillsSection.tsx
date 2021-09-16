import { useReducer, useState } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { updateSheet } from '@/api/sheet'
import { IconButton } from '@/components/styled/IconButton'
import { Typography } from '@/components/styled/Typography'
import { useCookie } from '@/context/CookiesContext'
import { sum } from '@/helpers/math'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { BaseSkillView } from './BaseSkillView'
import { CustomSkillView } from './CustomSkillView'
import { FirstAid } from './FirstAid'
import { MultiSkillView } from './MultiSkillView'
import { Revive } from './Revive'
import { SingleSkillView } from './SingleSkillView'
import { skillsReducer } from './SkillsReducer'
import { ValueMonitor } from './ValueMonitor'
import styles from './SkillsSection.module.sass'
import {
  EXSkills,
  isSingle,
  MultiSkill,
  SingleSkill,
  Skills,
  Status,
} from '../types'

const points = [0, 1, 5, 15]
const doubleIf = (n: number, flag: boolean) => (flag ? n * 2 : n)

const computePoints = (skill: SingleSkill | MultiSkill) =>
  doubleIf(
    isSingle(skill)
      ? points[skill.level]
      : sum(skill.genres.map((genre) => points[genre.level])),
    EXSkills.includes(skill.name),
  )

export interface SkillsSectionProps {
  sheetId: string
  status: Status
  skills: Skills
  disabled?: boolean
}

export const SkillsSection = ({
  sheetId,
  skills: init,
  status,
  disabled,
}: SkillsSectionProps) => {
  const token = useCookie('token')

  const [skills, dispatch] = useReducer(skillsReducer, init)

  useUpdateEffect(() => {
    if (!disabled && token) {
      updateSheet(sheetId, { data: { skills } }, token)
    }
  }, [skills])

  const total =
    sum(
      skills.presets.map(({ groups }) =>
        sum(groups.map(({ skills }) => sum(skills.map(computePoints)))),
      ),
    ) + sum(skills.custom.map(({ level }) => points[level]))

  const [hideInit, setHideInit] = useState(disabled)

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <Typography variant="h1">技能</Typography>

          <ValueMonitor
            value={total}
            base={30}
            extra={skills.extra}
            onChange={(extra) => dispatch({ type: 'extra', extra })}
          />
        </div>

        <div>
          <IconButton
            variant="outline"
            color="light"
            icon={hideInit ? faEye : faEyeSlash}
            onClick={() => setHideInit((prev) => !prev)}
          />
        </div>
      </div>

      {skills.presets.map(({ name, groups }, categoryIndex) => (
        <div key={categoryIndex} className={classes.category}>
          <Typography variant="h2">{name}</Typography>

          {groups.map(({ name, base, skills }, groupIndex) => (
            <div key={groupIndex} className={classes.group}>
              {name === '手当て' ? (
                <FirstAid name={name} base={base} status={status} />
              ) : (
                <BaseSkillView name={name} base={base} status={status} />
              )}

              {skills.map((skill, skillIndex) =>
                isSingle(skill) ? (
                  skill.name === '蘇生' ? (
                    <Revive
                      key={skillIndex}
                      skill={skill}
                      status={status}
                      disabled={disabled}
                      hideInit={hideInit}
                      dispatch={dispatch}
                    />
                  ) : (
                    <SingleSkillView
                      key={skillIndex}
                      skill={skill}
                      status={status}
                      disabled={disabled}
                      hideInit={hideInit}
                      dispatch={dispatch}
                    />
                  )
                ) : (
                  <MultiSkillView
                    key={skillIndex}
                    skill={skill}
                    status={status}
                    disabled={disabled}
                    hideInit={hideInit}
                    dispatch={dispatch}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      ))}

      <CustomSkillView
        custom={skills.custom}
        status={status}
        disabled={disabled}
        dispatch={dispatch}
      />
    </div>
  )
}
