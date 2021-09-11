import {
  ChangeEvent,
  ChangeEventHandler,
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'

export type BaseInputProps = ComponentPropsWithRef<'input'> & {
  onCommit?: ChangeEventHandler<HTMLInputElement>
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      onCommit,
      disabled,
      onChange,
      onCompositionStart,
      onCompositionEnd,
      ...props
    },
    ref,
  ) => {
    const onCommitRef = useRef(onCommit)
    useEffect(() => {
      onCommitRef.current = onCommit
    }, [onCommit])

    const [composing, setComposing] = useState(false)
    const [changeEvent, setChangeEvent] =
      useState<ChangeEvent<HTMLInputElement> | null>(null)

    useEffect(() => {
      if (changeEvent) {
        if (!composing && onCommitRef.current) {
          onCommitRef.current(changeEvent)
        }
      }
    }, [changeEvent, composing])

    return (
      <input
        ref={ref}
        onChange={(event) => {
          if (onChange) onChange(event)
          setChangeEvent(event)
        }}
        onCompositionStart={(event) => {
          if (onCompositionStart) onCompositionStart(event)
          setComposing(true)
        }}
        onCompositionEnd={(event) => {
          if (onCompositionEnd) onCompositionEnd(event)
          setComposing(false)
        }}
        disabled={disabled}
        {...props}
      />
    )
  },
)

BaseInput.displayName = 'BaseInput'
