import clsx from 'clsx'
import { Component, ComponentProps } from 'solid-js'

export type ArticleProps = ComponentProps<'article'>

export const Article: Component<ArticleProps> = (props) => (
  <article
    class={clsx(
      props.class,
      'flex flex-col items-center w-screen min-h-screen bg-nord-50 text-nord-1000 dark:bg-nord-950 dark:text-nord-0 transition',
    )}
  >
    {props.children}
  </article>
)
