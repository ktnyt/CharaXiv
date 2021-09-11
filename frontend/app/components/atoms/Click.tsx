import {
  MouseEvent,
  MouseEventHandler,
  TouchEvent,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'

export interface ClickRenderProps {
  onMouseDown: MouseEventHandler
  onMouseUp: MouseEventHandler
  onTouchStart: TouchEventHandler
  onTouchEnd: TouchEventHandler
  onTouchCancel: TouchEventHandler
}

export interface ClickProps {
  threshold?: number
  disabled?: boolean
  render: (props: ClickRenderProps) => JSX.Element
  onClick?: (event: MouseEvent | TouchEvent) => void
}

export const Click = ({
  threshold = 16,
  disabled,
  render,
  onClick,
}: ClickProps) => {
  const onClickRef = useRef(onClick)

  useEffect(() => {
    onClickRef.current = onClick
  }, [onClick, disabled])

  const [clicked, setClicked] = useState(false)
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const onMouseDown: MouseEventHandler = (event) => {
    setClicked(true)
    setOrigin({ x: event.pageX, y: event.pageY })
  }

  const onMouseUp: MouseEventHandler = (event) => {
    const dx = event.pageX - origin.x
    const dy = event.pageY - origin.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (!disabled && clicked && d < threshold && onClick) {
      onClick(event)
    }
    setClicked(false)
  }

  const onTouchStart: TouchEventHandler = (event) => {
    if (event.touches.length === 1) {
      setClicked(true)
      setOrigin({ x: event.touches[0].pageX, y: event.touches[0].pageY })
    }
  }

  const onTouchEnd: TouchEventHandler = (event) => {
    if (event.touches.length === 1) {
      const dx = event.touches[0].pageX - origin.x
      const dy = event.touches[0].pageY - origin.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (clicked && d < threshold && onClick) {
        onClick(event)
      }
      setClicked(false)
    }
  }

  const onTouchCancel: TouchEventHandler = () => setClicked(false)

  return render({
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
  })
}
