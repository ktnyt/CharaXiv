import { Dispatch, useState } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Twemoji } from '@/components/atoms/Twemoji'
import { Button } from '@/components/styled/Button'
import { IconButton } from '@/components/styled/IconButton'
import { Input } from '@/components/styled/Input'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { range, replacer } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import { SkillsAction } from './SkillsReducer'
import styles from './CustomSkillView.module.sass'
import { CustomSkill, Status, VariableEmoji, VariableKeys } from '../types'

export interface CustomSkillViewProps {
  custom: CustomSkill[]
  status: Status
  disabled?: boolean
  dispatch: Dispatch<SkillsAction>
}

export const CustomSkillView = ({
  custom,
  status,
  disabled,
  dispatch,
}: CustomSkillViewProps) => {
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
              dispatch({ type: 'custom-name', index, name: event.target.value })
            }
          />

          <SlideSelector
            className="base"
            defaultIndex={VariableKeys.indexOf(skill.base)}
            disabled={disabled}
            onCommit={(value) =>
              dispatch({
                type: 'custom-base',
                index,
                base: VariableKeys[value],
              })
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
              dispatch({ type: 'custom-level', index, level })
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
                onClick={() => dispatch({ type: 'delete-custom', index })}
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
            onClick={() => dispatch({ type: 'create-custom' })}
          >
            技能を追加
          </Button>
        </div>
      )}
    </div>
  )
}
