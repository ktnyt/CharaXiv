import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { appender, pop, remover } from '@/helpers/array'
import { useGetTextWidth } from '@/hooks/useGetTextWidth'
import { useInput } from '@/hooks/useInput'
import { useStyles } from '@/hooks/useStyles'
import { Tag } from './Tag'
import styles from './Tags.module.sass'

export interface TagsProps {
  defaultValues: string[]
  disabled?: boolean
  onChangeValues?: (values: string[]) => void
}

export const Tags = ({
  defaultValues,
  disabled,
  onChangeValues,
}: TagsProps) => {
  const [values, setValues] = useState(defaultValues)

  useEffect(() => {
    if (onChangeValues) onChangeValues(values)
  }, [values, onChangeValues])

  const [composing, setComposing] = useState(false)

  const [inputValue, onChangeInputValue, setValue] = useInput('')
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      !composing &&
      inputValue !== '' &&
      !values.includes(inputValue) &&
      ['Enter', 'Tab'].includes(event.key)
    ) {
      event.preventDefault()
      setValues(appender(inputValue))
      setValue('')
    }

    if (inputValue === '' && event.key === 'Backspace') {
      setValues(pop)
    }
  }

  const handleRemoveButton = (index: number) => setValues(remover(index))

  const inputRef = useRef<HTMLInputElement>(null!)
  const getWidth = useGetTextWidth(inputRef, 8)

  const classes = useStyles(styles)

  return (
    <div
      className={clsx(classes.container, disabled && classes.disabled)}
      onClick={() => inputRef.current.focus()}
    >
      {values.map((value, index) => (
        <div key={index} className={classes.item}>
          <Tag
            value={value}
            disabled={disabled}
            onRemove={() => handleRemoveButton(index)}
          />
        </div>
      ))}

      {!disabled && (
        <div>
          <input
            ref={inputRef}
            className={classes.input}
            value={inputValue}
            onChange={onChangeInputValue}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            disabled={disabled}
            style={{ width: getWidth(inputValue) + 16 }}
          />
        </div>
      )}
    </div>
  )
}
