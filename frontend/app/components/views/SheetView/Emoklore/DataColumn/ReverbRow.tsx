import { Reverb } from './types'
import { useEffect, useRef, useState } from 'react'
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '@/components/styled/IconButton'
import { Input } from '@/components/styled/Input'
import { useStyles } from '@/hooks/useStyles'
import styles from './ReverbRow.module.sass'

export interface ReverbProps {
  reverb: Reverb
  disabled: boolean
  onChange: (reverb: Reverb) => void
  onRemove: () => void
}

export const ReverbRow = ({
  reverb: init,
  disabled,
  onChange,
  onRemove,
}: ReverbProps) => {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [reverb, setReverb] = useState(init)
  useEffect(() => {
    onChangeRef.current(reverb)
  }, [reverb])

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <IconButton
        variant="textual"
        color="dark"
        icon={reverb.consumed ? faCheckSquare : faSquare}
        disabled={disabled}
        onClick={() =>
          setReverb(({ consumed, ...prev }) => ({
            ...prev,
            consumed: !consumed,
          }))
        }
      />

      <Input
        placeholder="シナリオ名"
        color="light"
        defaultValue={reverb.scenario}
        disabled={disabled}
        onCommit={(event) =>
          setReverb((prev) => ({ ...prev, scenario: event.target.value }))
        }
      />

      <Input
        placeholder="感情"
        color="light"
        defaultValue={reverb.emotion}
        disabled={disabled}
        onCommit={(event) =>
          setReverb((prev) => ({ ...prev, emotion: event.target.value }))
        }
      />

      <div>
        {!disabled && (
          <IconButton
            variant="textual"
            color="danger"
            icon={faTrashAlt}
            onClick={onRemove}
          />
        )}
      </div>
    </div>
  )
}
