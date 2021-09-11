import {
  ChangeEvent,
  ChangeEventHandler,
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useState,
} from 'react'

export type BaseTextAreaProps = ComponentPropsWithRef<'textarea'> & {
  onCommit?: ChangeEventHandler<HTMLTextAreaElement>
}

export const BaseTextArea = forwardRef<HTMLTextAreaElement, BaseTextAreaProps>(
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
    const [composing, setComposing] = useState(false)
    const [changeEvent, setChangeEvent] =
      useState<ChangeEvent<HTMLTextAreaElement> | null>(null)

    useEffect(() => {
      if (changeEvent) {
        if (!composing && onCommit) {
          onCommit(changeEvent)
        }
      }
    }, [changeEvent, composing, onCommit])

    return (
      <textarea
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

BaseTextArea.displayName = 'BaseTextArea'
