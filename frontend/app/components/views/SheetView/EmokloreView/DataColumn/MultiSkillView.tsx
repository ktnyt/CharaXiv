import { maxVariable, maxVariableKey } from './utils'
import { useEffect, useRef, useState } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/styled/Button'
import { IconButton } from '@/components/styled/IconButton'
import { Input } from '@/components/styled/Input'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { appender, range, remover, swapper } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import { BaseSkillView } from './BaseSkillView'
import styles from './MultiSkillView.module.sass'
import { MultiSkill, SkillGenre, Status } from '../types'

export interface MultiSkillViewProps {
  skill: MultiSkill
  status: Status
  disabled?: boolean
  hideInit?: boolean
  onChange: (skill: MultiSkill) => void
}

export const MultiSkillView = ({
  skill,
  status,
  disabled,
  hideInit,
  onChange,
}: MultiSkillViewProps) => {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const skillRef = useRef(skill)
  useEffect(() => {
    skillRef.current = skill
  }, [skill])

  const [genres, setGenres] = useState(skill.genres)

  useEffect(() => {
    onChangeRef.current({
      ...skillRef.current,
      genres,
    })
  }, [genres])

  const classes = useStyles(styles)

  return !hideInit ? (
    <div className={classes.container}>
      <BaseSkillView
        name={skill.name}
        base={maxVariableKey(status, skill.base)}
        status={status}
      />

      {genres.map((genre, index) => (
        <div key={index} className={classes.genre}>
          <Input
            value={genre.label}
            placeholder={skill.name}
            onChange={(event) =>
              setGenres(
                swapper<SkillGenre>(
                  ({ level }) => ({ label: event.target.value, level }),
                  index,
                ),
              )
            }
          />

          <SlideSelector
            defaultIndex={genre.level}
            disabled={disabled}
            onCommit={(level) =>
              setGenres(
                swapper<SkillGenre>(({ label }) => ({ label, level }), index),
              )
            }
          >
            {range(0, 3).map((value, index) => (
              <span key={index}>{value}</span>
            ))}
          </SlideSelector>

          <Typography variant="body1" className="bold">
            {genre.level + maxVariable(status, skill.base)}
          </Typography>

          <IconButton
            variant="textual"
            color="danger"
            icon={faTrashAlt}
            onClick={() => setGenres(remover(index))}
          />
        </div>
      ))}

      <div className={classes.button}>
        {!disabled && (
          <Button
            variant="outline"
            color="primary"
            onClick={() => setGenres(appender({ label: '', level: 0 }))}
          >{`${skill.name}を追加`}</Button>
        )}
      </div>
    </div>
  ) : null
}
