import { useEffect, useRef, useState } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Twemoji } from '@/components/atoms/Twemoji'
import { Button } from '@/components/styled/Button'
import { IconButton } from '@/components/styled/IconButton'
import { Input } from '@/components/styled/Input'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { appender, range, remover, replacer, swapper } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import styles from './CustomSkillView.module.sass'
import {
  CustomSkill,
  Status,
  VariableEmoji,
  VariableKey,
  VariableKeys,
} from '../types'

export interface CustomSkillViewProps {
  custom: CustomSkill[]
  status: Status
  disabled?: boolean
  onChange: (custom: CustomSkill[]) => void
}

export const CustomSkillView = ({
  custom: init,
  status,
  disabled,
  onChange,
}: CustomSkillViewProps) => {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [custom, setCustom] = useState(init)
  useUpdateEffect(() => {
    onChangeRef.current(custom)
  }, [custom])

  const [names, setNames] = useState(custom.map(({ name }) => name))

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <Typography variant="h2">その他</Typography>

      {custom.map((skill, index) => (
        <div key={index} className={classes.custom}>
          <Input
            className="name"
            value={names[index]}
            placeholder="技能"
            disabled={disabled}
            onChange={(event) => setNames(replacer(event.target.value, index))}
            onCommit={(event) =>
              setCustom(
                swapper(
                  (prev) => ({ ...prev, name: event.target.value }),
                  index,
                ),
              )
            }
          />

          <SlideSelector
            className="base"
            defaultIndex={VariableKeys.indexOf(skill.base)}
            disabled={disabled}
            onCommit={(value) =>
              setCustom(
                swapper(
                  (prev) => ({
                    ...prev,
                    base: VariableKeys[value],
                  }),
                  index,
                ),
              )
            }
          >
            {VariableKeys.map((key, index) => (
              <Twemoji key={index} emoji={VariableEmoji[key]} />
            ))}
          </SlideSelector>

          <SlideSelector
            className="level"
            defaultIndex={skill.level}
            disabled={disabled}
            onCommit={(level) =>
              setCustom(swapper((prev) => ({ ...prev, level }), index))
            }
          >
            {range(0, 3).map((value, index) => (
              <span key={index}>{value}</span>
            ))}
          </SlideSelector>

          <Typography variant="body1" className="value">
            {status.variables[skill.base] + skill.level}
          </Typography>

          <div className="remove">
            {!disabled && (
              <IconButton
                variant="textual"
                color="danger"
                icon={faTrashAlt}
                className="remove"
                onClick={() => setCustom(remover(index))}
              />
            )}
          </div>
        </div>
      ))}

      {!disabled && (
        <div className={classes.button}>
          <Button
            variant="outline"
            color="primary"
            onClick={() =>
              setCustom(
                appender({ name: '', base: '身体' as VariableKey, level: 0 }),
              )
            }
          >
            技能を追加
          </Button>
        </div>
      )}
    </div>
  )
}
