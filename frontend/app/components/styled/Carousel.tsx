import { Children, ReactNode, useEffect, useRef, useState } from 'react'
import { clamp } from '@/helpers/math'
import { useSize } from '@/hooks/useSize'
import { useStyles } from '@/hooks/useStyles'
import { useThrottle } from '@/hooks/useThrottle'
import styles from './Carousel.module.sass'
import { Drag } from '../atoms/Drag'

export interface CarouselProps {
  index: number
  children?: ReactNode
  onChange?: (index: number) => void
}

export const Carousel = ({ index, children, onChange }: CarouselProps) => {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [dragging, setDragging] = useState(false)
  const [rawDelta, setDelta] = useState(0)
  const delta = useThrottle(rawDelta, 20)

  const ref = useRef<HTMLDivElement>(null!)
  const size = useSize(ref)
  const offset = clamp(
    index * size.width + delta,
    0,
    (Children.count(children) - 1) * size.width,
  )

  const classes = useStyles(styles)

  return (
    <Drag
      onDrag={() => setDragging(true)}
      onChange={({ x }) => setDelta(x)}
      onCommit={() => {
        if (onChangeRef.current) {
          onChangeRef.current(Math.ceil(offset / size.width - 0.5))
        }
        setDragging(false)
        setDelta(0)
      }}
      render={(props) => (
        <div ref={ref} className={classes.viewport} {...props}>
          <div
            className={classes.slider}
            style={{
              transform: `translateX(-${offset}px)`,
              transition: dragging ? 'none' : 'transform 0.5s',
            }}
          >
            {Children.map(children, (child, index) => (
              <div key={index} style={{ ...size }}>
                {child}
              </div>
            ))}
          </div>
        </div>
      )}
    />
  )
}
