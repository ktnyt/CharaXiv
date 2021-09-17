import { maxVariableKey } from './utils'
import { Dispatch } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Twemoji } from '@/components/atoms/Twemoji'
import { Button } from '@/components/styled/Button'
import { IconButton } from '@/components/styled/IconButton'
import { Input } from '@/components/styled/Input'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { range } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import { SkillsAction } from './SkillsReducer'
import styles from './MultiSkillView.module.sass'
import { EXSkills, MultiSkill, Status, VariableEmoji } from '../types'

export interface MultiSkillViewProps {
  skill: MultiSkill
  status: Status
  disabled?: boolean
  hideInit?: boolean
  dispatch: Dispatch<SkillsAction>
}

export const MultiSkillView = ({
  skill: { name, base, bases, genres },
  status,
  disabled,
  hideInit,
  dispatch,
}: MultiSkillViewProps) => {
  const key = base || maxVariableKey(status, bases)

  const classes = useStyles(styles)

  return !hideInit || genres.length > 0 ? (
    <div className={classes.container}>
      <div className={classes.base}>
        <Typography variant="body1" className="bold">
          {EXSkills.includes(name) ? `★${name}` : name}
        </Typography>

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

        <Typography variant="body1" className="bold">
          {status.variables[key]}
        </Typography>
      </div>

      {genres.map((genre, index) => (
        <div key={index} className={classes.genre}>
          <Input
            value={genre.label}
            placeholder={name}
            onChange={(event) =>
              dispatch({
                type: 'genre-label',
                name,
                index,
                label: event.target.value,
              })
            }
          />

          <SlideSelector
            defaultIndex={genre.level}
            disabled={disabled}
            onCommit={(level) =>
              dispatch({ type: 'genre-level', name, index, level })
            }
          >
            {range(0, 3).map((value, index) => (
              <span key={index}>{value}</span>
            ))}
          </SlideSelector>

          <Typography variant="body1" className="bold">
            {status.variables[key] + genre.level}
          </Typography>

          <IconButton
            variant="textual"
            color="danger"
            icon={faTrashAlt}
            onClick={() => dispatch({ type: 'delete-genre', name, index })}
          />
        </div>
      ))}

      <div className={classes.button}>
        {!disabled && (
          <Button
            variant="outline"
            color="primary"
            onClick={() => dispatch({ type: 'create-genre', name })}
          >
            {`${name}を追加`}
          </Button>
        )}
      </div>
    </div>
  ) : null
}
