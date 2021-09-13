import { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { append, appender, remove, remover } from '@/helpers/array'
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

  const [selected, setSelected] = useState<number[]>([])
  const toggleSelect = (index: number) =>
    setSelected((prev) =>
      prev.includes(index)
        ? remove(prev, prev.indexOf(index))
        : append(prev, index),
    )

  const [composing, setComposing] = useState(false)
  const [deletable, setDeletable] = useState(true)

  const [inputValue, onChangeInputValue, setValue] = useInput('')
  const handleKeyDown: KeyboardEventHandler = (event) => {
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
      if (selected.length > 0 && deletable) {
        setSelected([])
        setValues(remover(...selected))
      } else {
        setSelected(appender(values.length - 1))
      }
      setDeletable(false)
    } else {
      setSelected([])
    }
  }
  const handleKeyUp = () => setDeletable(true)

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
            selected={selected.includes(index)}
            disabled={disabled}
            onClick={() => toggleSelect(index)}
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
            onKeyUp={handleKeyUp}
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
