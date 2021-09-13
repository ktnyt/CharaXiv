import {
  Children,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { clamp } from '@/helpers/math'
import { useSize } from '@/hooks/useSize'
import { useStyles } from '@/hooks/useStyles'
import { useThrottle } from '@/hooks/useThrottle'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import styles from './SlideSelector.module.sass'
import { Click } from '../atoms/Click'
import { Drag } from '../atoms/Drag'
import { Stack } from '../atoms/Stack'

export interface SlideSelectorProps {
  index?: number
  defaultIndex?: number
  disabled?: boolean
  onCommit?: (value: number) => void
  children?: ReactNode
}

export const SlideSelector = ({
  index: given,
  defaultIndex,
  disabled,
  onCommit,
  children,
}: SlideSelectorProps) => {
  const onCommitRef = useRef(onCommit)
  useEffect(() => {
    onCommitRef.current = onCommit
  }, [onCommit])

  const [index, setIndex] = useState(given || defaultIndex || 0)
  useUpdateEffect(() => {
    if (onCommitRef.current) {
      onCommitRef.current(index)
    }
  }, [index])

  useEffect(() => {
    if (given) {
      setIndex(given)
    }
  }, [given])

  const [dragging, setDragging] = useState(false)
  const [rawDelta, setDelta] = useState(0)
  const delta = useThrottle(rawDelta, 1000 / 60)

  const viewport = useRef<HTMLDivElement>(null!)
  const size = useSize(viewport)

  const computeOffset = useCallback(() => {
    return -40 * index + size.width / 2 - 20 - delta
  }, [size, index, delta])

  const offset = computeOffset()

  const classes = useStyles(styles)

  return (
    <Stack>
      <div ref={viewport} className={classes.viewport}>
        <Drag
          disabled={disabled}
          onDrag={() => setDragging(true)}
          onCommit={() => {
            setIndex((prev) =>
              clamp(
                prev + Math.floor(delta / 40 + 0.5),
                0,
                Children.count(children) - 1,
              ),
            )
            setDelta(0)
            setDragging(false)
          }}
          onChange={({ x }) => setDelta(x)}
          render={(props) => (
            <div
              className={classes.container}
              style={{
                transform: `translateX(${offset}px)`,
                transition: dragging ? 'none' : 'transform 0.3s',
              }}
              {...props}
            >
              {Children.map(children, (child, index) => (
                <Click
                  key={index}
                  disabled={disabled}
                  onClick={() => setIndex(index)}
                  render={(props) => (
                    <div className={classes.item} {...props}>
                      {child}
                    </div>
                  )}
                />
              ))}
            </div>
          )}
        />
      </div>
      <div className={classes.overlayWhite}></div>
      <div className={classes.overlayBlack}></div>
    </Stack>
  )
}
