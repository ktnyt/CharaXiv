import clsx from 'clsx'
import {
  Component,
  createEffect,
  createSignal,
  Index,
  JSX,
  Show,
  untrack,
} from 'solid-js'
import { createThrottle } from '../hooks/createThrottle'
import { Drag, PointerEvent, getEventCoords } from './Drag'
import { InputBase } from './InputBase'

const THRESHOLD = 25
const stick = (n: number) => Math.sign(n) * Math.pow(Math.abs(n), 0.75)

type Coord = {
  x: number
  y: number
}

const norm = ({ x, y }: Coord) => Math.sqrt(x * x + y * y)

export type UpdateHandler = (values: string[]) => void

type DragState = {
  index: number
  origin: Coord
  stuck: boolean
}

const seq = (n: number) => [...Array(n).keys()]

const reinsert = <T extends unknown>(array: T[], i: number, j: number) =>
  i < j
    ? [
        ...array.slice(0, i),
        ...array.slice(i + 1, j + 1),
        array[i],
        ...array.slice(j + 1),
      ]
    : j < i
    ? [
        ...array.slice(0, j),
        array[i],
        ...array.slice(j, i),
        ...array.slice(i + 1),
      ]
    : array

type TagProps = {
  delete?: () => void
  readonly: boolean
  selected?: boolean
  children: string
}

const Tag: Component<TagProps> = (props) => {
  const style = (select: boolean) => select === (props.selected ?? false)
  const selected = () => props.selected ?? false
  return (
    <div
      class={clsx(
        'flex flex-row rounded-sm align-center text-base leading-4 proportional-nums cursor-grab transition',
        selected()
          ? 'bg-nord-100 text-nord-1000 dark:bg-nord-900 dark:text-nord-0'
          : 'bg-nord-150 text-nord-1000 dark:bg-nord-850 dark:text-nord-0',
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <div class={clsx(props.readonly ?? false ? 'px-1.5' : 'pl-1.5', 'py-1')}>
        <span class="inline-block ">{props.children}</span>
      </div>
      <Show when={!(props.readonly ?? false)}>
        <button
          class={clsx(
            'flex justify-center items-center h-6 rounded-sm aspect-square transition',
            selected()
              ? 'bg-nord-100 text-nord-800 hover:bg-nord-150 dark:bg-nord-900 dark:text-nord-200 dark:hover:bg-nord-850'
              : 'bg-nord-150 text-nord-800 hover:bg-nord-200 dark:bg-nord-850 dark:text-nord-200 dark:hover:bg-nord-800',
          )}
          onClick={props.delete}
        >
          <i class="fas fa-times" />
        </button>
      </Show>
    </div>
  )
}

export type TagInputProps = {
  values?: string[]
  update?: UpdateHandler
  readonly?: boolean
}

export const TagInput: Component<TagInputProps> = (props) => {
  const [values, setValues] = createSignal(props.values || [])
  const count = () => values().length
  createEffect(() => {
    const { update } = props
    if (update) update(values())
  })

  const readonly = () => props.readonly ?? false

  const [order, setOrder] = createSignal(seq(count()))
  createEffect(() => setOrder(seq(count())))

  const renderValues = () => order().map((index) => values()[index])

  const tagRefMap = new Map<number, HTMLDivElement>()
  const tagRects = () =>
    [...Array(count()).keys()].map((index) => {
      const el = tagRefMap.get(index)
      if (!el) throw new Error('ref has not been set')
      return el.getBoundingClientRect()
    })

  let drag: DragState | undefined

  const [coord, setCoord] = createSignal<Coord>()
  const throttledCoord = createThrottle(coord, 1000 / 60)

  createEffect(() => {
    const currentCoord = throttledCoord()
    if (!currentCoord || !drag) return
    const { x, y } = currentCoord
    const nextIndex = untrack(tagRects).findIndex(
      ({ top, right, bottom, left }) =>
        left <= x && x <= right && top <= y && y <= bottom,
    )
    if (nextIndex < 0) return
    setOrder(reinsert(seq(count()), drag.index, nextIndex))
  })

  const toActualIndex = (from: number) =>
    order().findIndex((index) => index === from)

  const tagStyle = (index: number) => {
    const currentCoord = throttledCoord()
    if (!currentCoord || !drag || toActualIndex(drag.index) !== index) return
    if (!drag.stuck) return { opacity: 0.5 }
    const x = stick(currentCoord.x - drag.origin.x)
    const y = stick(currentCoord.y - drag.origin.y)
    return { transform: `translateX(${x}px) translateY(${y}px)` }
  }

  const [selected, setSelected] = createSignal<number[]>([])

  const tagDragStart = (index: number) => (event: PointerEvent) => {
    const { clientX: x, clientY: y } = getEventCoords(event)
    const origin = { x, y }
    drag = { index, origin, stuck: true }
  }

  const tagDragMove = (event: PointerEvent) => {
    if (drag) {
      const { clientX: x, clientY: y } = getEventCoords(event)
      const cursor = { x, y }
      const offset = {
        x: cursor.x - drag.origin.x,
        y: cursor.y - drag.origin.y,
      }
      drag.stuck = norm(offset) < THRESHOLD && drag.stuck
      setCoord(cursor)
    }
  }

  const tagDragEnd = () => {
    setCoord()
    setValues(renderValues())
    setOrder(seq(count()))
    drag = undefined
  }

  let inputRef!: HTMLInputElement

  const [inputValue, setInputValue] = createSignal('')

  const inputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event,
  ) => {
    const value = inputValue()
    if (
      value !== '' &&
      !values().includes(value) &&
      ['Enter', 'Tab'].includes(event.key)
    ) {
      event.preventDefault()
      setValues((prev) => [...prev, value])
      setInputValue('')
      event.currentTarget.value = ''
    }

    if (value === '' && event.key === 'Backspace') {
      const indices = selected()
      if (indices.length === 0) {
        setSelected([count() - 1])
      } else {
        setValues((prev) => prev.filter((_, index) => !indices.includes(index)))
        setSelected([])
      }
    } else {
      setSelected([])
    }
  }

  return (
    <>
      <div
        class="flex flex-row flex-wrap items-center gap-2 px-2 py-1 w-full min-h-[34px] border border-solid rounded bg-nord-500 bg-opacity-0 hover:bg-opacity-10 cursor-text transition border-nord-600 text-nord-1000 dark:border-nord-400 dark:text-nord-0"
        onClick={() => inputRef.focus()}
      >
        <Index each={renderValues()}>
          {(value, index) => (
            <Drag
              onDragStart={tagDragStart(index)}
              onDragMove={tagDragMove}
              onDragEnd={tagDragEnd}
            >
              {(dragProps) => (
                <div
                  ref={(el) => tagRefMap.set(index, el)}
                  style={tagStyle(index)}
                  {...dragProps}
                >
                  <Tag
                    delete={() =>
                      setValues((prev) => [
                        ...prev.slice(0, index),
                        ...prev.slice(index + 1),
                      ])
                    }
                    readonly={readonly()}
                    selected={selected().includes(index)}
                  >
                    {value()}
                  </Tag>
                </div>
              )}
            </Drag>
          )}
        </Index>

        <div class="flex-grow">
          <InputBase
            ref={inputRef}
            class="w-full min-w-[80px] border-none bg-nord-0 bg-opacity-0 active:outline-none focus:outline-none transition caret-nord-1000 dark:caret-nord-0"
            size={1}
            spellcheck={false}
            placeholder="タグを追加"
            onInput={(event) => setInputValue(event.currentTarget.value)}
            onKeyDown={inputKeyDown}
          />
        </div>
      </div>

      <Show when={throttledCoord()} keyed>
        {(cursor) => {
          if (!drag || drag.stuck) return null
          const ref = tagRefMap.get(drag.index)
          if (!ref) return null
          const rect = ref.getBoundingClientRect()
          const x = cursor.x - rect.width / 2
          const y = cursor.y - rect.height / 2
          const style = { transform: `translateX(${x}px) translateY(${y}px)` }
          return (
            <div class="fixed top-0 left-0" style={style}>
              <Tag readonly={readonly()}>{values()[drag.index]}</Tag>
            </div>
          )
        }}
      </Show>
    </>
  )
}
