import { useEffect, useRef } from 'react'
import twemoji from 'twemoji'
import styles from './Twemoji.module.sass'

export interface TwemojiProps {
  emoji: string
}

export const Twemoji = ({ emoji }: TwemojiProps) => {
  const ref = useRef<HTMLSpanElement>(null!)
  useEffect(() => {
    twemoji.parse(ref.current)
  }, [emoji])
  return (
    <span ref={ref} className={styles.twemoji}>
      {emoji}
    </span>
  )
}
