import { useEffect, useReducer, useRef, useState } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '@/components/styled/IconButton'
import { Typography } from '@/components/styled/Typography'
import { replace, swap } from '@/helpers/array'
import { sum } from '@/helpers/math'
import { useStyles } from '@/hooks/useStyles'
import { BaseSkillView } from './BaseSkillView'
import { CustomSkillView } from './CustomSkillView'
import { MultiSkillView } from './MultiSkillView'
import { SingleSkillView } from './SingleSkillView'
import { ValueMonitor } from './ValueMonitor'
import styles from './SkillsSection.module.sass'
import {
  CustomSkill,
  isSingle,
  MultiSkill,
  SingleSkill,
  Skills,
  Status,
} from '../types'

type Action =
  | {
      type: 'preset'
      categoryIndex: number
      groupIndex: number
      skillIndex: number
      skill: SingleSkill | MultiSkill
    }
  | { type: 'extra'; value: number }
  | { type: 'custom'; custom: CustomSkill[] }

const reducer = (skills: Skills, action: Action): Skills => {
  switch (action.type) {
    case 'preset':
      return {
        ...skills,
        presets: swap(
          skills.presets,
          (category) => ({
            ...category,
            groups: swap(
              category.groups,
              (group) => ({
                ...group,
                skills: replace(group.skills, action.skill, action.skillIndex),
              }),
              action.groupIndex,
            ),
          }),
          action.categoryIndex,
        ),
      }

    case 'extra':
      return { ...skills, extra: action.value }

    case 'custom':
      return {
        ...skills,
        custom: action.custom,
      }

    default:
      return skills
  }
}

const points = [0, 1, 5, 15]
const doubleIf = (n: number, flag: boolean) => (flag ? n * 2 : n)

const computePoints = (skill: SingleSkill | MultiSkill) =>
  doubleIf(
    isSingle(skill)
      ? points[skill.level]
      : sum(skill.genres.map((genre) => points[genre.level])),
    skill.ex,
  )

export interface SkillsSectionProps {
  status: Status
  skills: Skills
  disabled?: boolean
  onChange: (skills: Skills) => void
}

export const SkillsSection = ({
  skills: init,
  status,
  disabled,
  onChange,
}: SkillsSectionProps) => {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [skills, dispatch] = useReducer(reducer, init)

  useEffect(() => {
    onChangeRef.current(skills)
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
            onChange={(extra) => dispatch({ type: 'extra', value: extra })}
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
              <BaseSkillView name={name} base={base} status={status} />

              {skills.map((skill, skillIndex) =>
                isSingle(skill) ? (
                  <SingleSkillView
                    key={skillIndex}
                    skill={skill}
                    status={status}
                    disabled={disabled}
                    hideInit={hideInit}
                    onChange={(skill) =>
                      dispatch({
                        type: 'preset',
                        categoryIndex,
                        groupIndex,
                        skillIndex,
                        skill,
                      })
                    }
                  />
                ) : (
                  <MultiSkillView
                    key={skillIndex}
                    skill={skill}
                    status={status}
                    disabled={disabled}
                    hideInit={hideInit}
                    onChange={(skill) =>
                      dispatch({
                        type: 'preset',
                        categoryIndex,
                        groupIndex,
                        skillIndex,
                        skill,
                      })
                    }
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
        onChange={(custom) => dispatch({ type: 'custom', custom })}
      />
    </div>
  )
}
