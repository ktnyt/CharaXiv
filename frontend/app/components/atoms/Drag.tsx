import {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'

export type DragType = 'mouse' | 'touch'

export interface DragProps {
  render: (props: {
    onMouseDown: MouseEventHandler
    onTouchStart: TouchEventHandler
  }) => JSX.Element
  disabled?: boolean
  onDrag?: (dragType: DragType) => void
  onChange?: (delta: { x: number; y: number }) => void
  onCommit?: (delta: { x: number; y: number }) => void
}

export const Drag = ({
  render,
  disabled,
  onDrag,
  onChange,
  onCommit,
}: DragProps) => {
  const onDragRef = useRef(onDrag)
  const onChangeRef = useRef(onChange)
  const onCommitRef = useRef(onCommit)

  useEffect(() => {
    onDragRef.current = onDrag
    onChangeRef.current = onChange
    onCommitRef.current = onCommit
  }, [onDrag, onChange, onCommit])

  const anchor = useRef({ x: 0, y: 0 })
  const [offset, setOffset] = useState(anchor.current)
  const offsetRef = useRef(offset)

  const dragging = useRef(false)

  useEffect(() => {
    if (dragging.current && onChangeRef.current) {
      onChangeRef.current({
        x: anchor.current.x - offset.x,
        y: anchor.current.y - offset.y,
      })
    }
    offsetRef.current = offset
  }, [offset])

  const onMouseDown: MouseEventHandler = (event) => {
    if (!disabled) {
      event.preventDefault()
      anchor.current = { x: event.pageX, y: event.pageY }
      dragging.current = true
      if (onDragRef.current) {
        onDragRef.current('mouse')
      }
    }
  }

  const onTouchStart: TouchEventHandler = (event) => {
    if (!disabled) {
      if (event.touches.length === 1) {
        anchor.current = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        }
        dragging.current = true
        if (onDragRef.current) {
          onDragRef.current('touch')
        }
      }
    }
  }

  useEffect(() => {
    if (!disabled) {
      const handleMouseMove = (event: MouseEvent) => {
        if (dragging.current) {
          setOffset({ x: event.pageX, y: event.pageY })
        }
      }

      const handleTouchMove = (event: TouchEvent) => {
        if (dragging.current && event.touches.length === 1) {
          setOffset({ x: event.touches[0].pageX, y: event.touches[0].pageY })
        }
      }

      const handleCleanup = (_: MouseEvent | TouchEvent) => {
        if (dragging.current && onCommitRef.current) {
          onCommitRef.current(offsetRef.current)
          dragging.current = false
        }
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleCleanup)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleCleanup)
      document.addEventListener('touchcancel', handleCleanup)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleCleanup)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleCleanup)
        document.removeEventListener('touchcancel', handleCleanup)
      }
    }
  }, [disabled])

  return render({ onMouseDown, onTouchStart })
}
