import {
  Children,
  Fragment,
  ReactNode,
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

const ITEM_WIDTH = 32
const HALF_WIDTH = ITEM_WIDTH / 2

export interface SlideSelectorProps {
  index?: number
  defaultIndex?: number
  disabled?: boolean
  flat?: boolean
  onCommit?: (value: number) => void
  children?: ReactNode
}

export const SlideSelector = ({
  index: given,
  defaultIndex,
  disabled,
  flat,
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
    if (typeof given === 'number') {
      setIndex(given)
    }
  }, [given])

  const [dragging, setDragging] = useState(false)
  const [rawDelta, setDelta] = useState(0)
  const delta = useThrottle(rawDelta, 1000 / 60)

  const viewport = useRef<HTMLDivElement>(null!)
  const size = useSize(viewport)

  const computeOffset = () => {
    const rawOffset = -ITEM_WIDTH * index + size.width / 2 - HALF_WIDTH - delta
    const left = rawOffset - (size.width / 2 - HALF_WIDTH)
    if (left > 0) {
      return rawOffset - (left - Math.sqrt(left))
    }
    const right =
      size.width / 2 +
      HALF_WIDTH -
      rawOffset -
      ITEM_WIDTH * Children.count(children)
    if (right > 0) {
      return rawOffset + (right - Math.sqrt(right))
    }
    return rawOffset
  }

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
                prev + Math.floor(delta / ITEM_WIDTH + 0.5),
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
      {!flat && (
        <Fragment>
          <div className={classes.overlayWhite}></div>
          <div className={classes.overlayBlack}></div>
        </Fragment>
      )}
    </Stack>
  )
}
