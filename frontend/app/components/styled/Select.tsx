import { useEffect, useRef, useState } from 'react'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useStyles } from '@/hooks/useStyles'
import { Icon } from './Icon'
import styles from './Select.module.sass'

export interface Option {
  value: string
  label: string
}

export interface SelectProps {
  options: Option[]
  defaultValue: Option
  onChange: (option: Option) => void
}

export const Select = ({ options, defaultValue, onChange }: SelectProps) => {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    onChangeRef.current(value)
  }, [value])

  const [open, setOpen] = useState(false)
  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    const handler = () => {
      if (openRef.current) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <div className={classes.control} onClick={() => setOpen((prev) => !prev)}>
        <div className={classes.label}>
          <span>{defaultValue.label}</span>
        </div>

        <span className={classes.divider} />

        <div className={classes.switch}>
          <Icon icon={faChevronDown} />
        </div>
      </div>

      {open && (
        <div className={classes.options}>
          {options.map((option) => (
            <div
              key={option.value}
              className={classes.option}
              onClick={(event) => {
                event.preventDefault()
                setValue(option)
              }}
            >
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
