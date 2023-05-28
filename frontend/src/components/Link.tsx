import { A, AnchorProps } from '@solidjs/router'
import clsx from 'clsx'
import { Component, ComponentProps } from 'solid-js'

export type LinkVariant = 'default' | 'outline' | 'textual'
export type LinkColor =
  | 'default'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple'

export type LinkProps = AnchorProps & {
  variant?: LinkVariant
  color?: LinkColor
  fullWidth?: boolean
}

export const Link: Component<LinkProps> = (props) => {
  const style = (variant: LinkVariant, color: LinkColor) =>
    variant === (props.variant ?? 'default') &&
    color === (props.color ?? 'default')
  return (
    <A
      {...props}
      class={clsx(
        props.class,
        'inline-flex justify-center items-center py-1.5 h-8 rounded text-base leading-4 select-none cursor-pointer transition',

        // prettier-ignore
        clsx(
          style('default', 'default') && 'border-none bg-nord-100   text-nord-800 hover:bg-nord-150   dark:bg-nord-900   dark:text-nord-200 dark:hover:bg-nord-850',
          style('default',    'blue') && 'border-none bg-blue-500   text-nord-0   hover:bg-blue-550   dark:bg-blue-500   dark:text-nord-0   dark:hover:bg-blue-450',
          style('default',   'green') && 'border-none bg-green-500  text-nord-0   hover:bg-green-550  dark:bg-green-500  dark:text-nord-0   dark:hover:bg-green-450',
          style('default',  'yellow') && 'border-none bg-yellow-500 text-nord-0   hover:bg-yellow-550 dark:bg-yellow-500 dark:text-nord-0   dark:hover:bg-yellow-450',
          style('default',     'red') && 'border-none bg-red-500    text-nord-0   hover:bg-red-550    dark:bg-red-500    dark:text-nord-0   dark:hover:bg-red-450',
          style('default',  'purple') && 'border-none bg-purple-500 text-nord-0   hover:bg-purple-550 dark:bg-purple-500 dark:text-nord-0   dark:hover:bg-purple-450',

          style('outline', 'default') && 'border-solid border border-nord-600   bg-nord-500   bg-opacity-0 text-nord-600   hover:bg-opacity-20 dark:border-nord-300 dark:bg-nord-500 dark:text-nord-300',
          style('outline',    'blue') && 'border-solid border border-blue-500   bg-blue-500   bg-opacity-0 text-blue-500   hover:bg-opacity-20',
          style('outline',   'green') && 'border-solid border border-green-500  bg-green-500  bg-opacity-0 text-green-500  hover:bg-opacity-20',
          style('outline',  'yellow') && 'border-solid border border-yellow-500 bg-yellow-500 bg-opacity-0 text-yellow-500 hover:bg-opacity-20',
          style('outline',     'red') && 'border-solid border border-red-500    bg-red-500    bg-opacity-0 text-red-500    hover:bg-opacity-20',
          style('outline',  'purple') && 'border-solid border border-purple-500 bg-purple-500 bg-opacity-0 text-purple-500 hover:bg-opacity-20',

          style('textual', 'default') && 'border-none bg-nord-500   bg-opacity-0 text-nord-600   hover:bg-opacity-20 dark:text-nord-300 ',
          style('textual',    'blue') && 'border-none bg-blue-500   bg-opacity-0 text-blue-500   hover:bg-opacity-20',
          style('textual',   'green') && 'border-none bg-green-500  bg-opacity-0 text-green-500  hover:bg-opacity-20',
          style('textual',  'yellow') && 'border-none bg-yellow-500 bg-opacity-0 text-yellow-500 hover:bg-opacity-20',
          style('textual',     'red') && 'border-none bg-red-500    bg-opacity-0 text-red-500    hover:bg-opacity-20',
          style('textual',  'purple') && 'border-none bg-purple-500 bg-opacity-0 text-purple-500 hover:bg-opacity-20',
        ),

        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',

        props.fullWidth && 'w-full',
      )}
    />
  )
}
