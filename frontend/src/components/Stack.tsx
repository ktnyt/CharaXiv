import clsx from 'clsx'
import {
  children as resolve,
  Component,
  ComponentProps,
  Index,
  splitProps,
} from 'solid-js'

export type StackProps = ComponentProps<'div'>

export const Stack: Component<StackProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const children = resolve(() => local.children)
  return (
    <div
      {...rest}
      class={clsx(
        'grid grid-cols-1 grid-rows-1 [&>*]:col-[1_/_1] [&>*]:row-[1_/_1]',
        local.class,
      )}
    >
      {children}
    </div>
  )
}
