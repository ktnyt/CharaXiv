import { useState } from 'react'
import { updateSheet } from '@/api/sheet'
import { Modal } from '@/components/styled/Modal'
import { Typography } from '@/components/styled/Typography'
import { useCookie } from '@/context/CookiesContext'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { EmotionButton } from './EmotionButton'
import styles from './EmotionSection.module.sass'
import { Emotions } from '../types'
import { EmotionTypes } from '../types'

export interface EmotionSectionProps {
  sheetId: string
  emotions: Emotions
  disabled: boolean
}

const EmotionFor: Record<keyof Emotions, string> = {
  outer: '表',
  inner: '裏',
  roots: 'ルーツ',
}

export const EmotionSection = ({
  sheetId,
  emotions: init,
  disabled,
}: EmotionSectionProps) => {
  const token = useCookie('token')

  const [emotions, setEmotions] = useState(init)
  useUpdateEffect(() => {
    if (token) {
      updateSheet(sheetId, { data: { emotions } }, token)
    }
  }, [emotions])

  const [open, setOpen] = useState<keyof Emotions | null>(null)

  const selected = [
    ...(emotions.outer ? [emotions.outer] : []),
    ...(emotions.inner ? [emotions.inner] : []),
    ...(emotions.roots ? [emotions.roots] : []),
  ]

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <Typography variant="h1">共鳴感情</Typography>

      <div className={classes.buttons}>
        <EmotionButton
          prefix={`${EmotionFor.outer}：`}
          emotion={emotions.outer}
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen('outer')}
        />
        <EmotionButton
          prefix={`${EmotionFor.inner}：`}
          emotion={emotions.inner}
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen('inner')}
        />
        <EmotionButton
          prefix={`${EmotionFor.roots}：`}
          emotion={emotions.roots}
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen('roots')}
        />
      </div>

      <Modal open={open !== null} handleClose={() => setOpen(null)}>
        {open && (
          <div className={classes.picker}>
            <Typography variant="h2">共鳴感情：{EmotionFor[open]}</Typography>
            <div className={classes.grid}>
              {EmotionTypes.map((emotion, index) => (
                <EmotionButton
                  key={index}
                  emotion={emotion}
                  variant={
                    emotions[open] === emotion
                      ? 'default'
                      : selected.includes(emotion)
                      ? 'lighten'
                      : 'outline'
                  }
                  onClick={() => {
                    setEmotions((prev) => {
                      const outer =
                        prev.outer === emotion
                          ? undefined
                          : open === 'outer'
                          ? emotion
                          : prev.outer
                      const inner =
                        prev.inner === emotion
                          ? undefined
                          : open === 'inner'
                          ? emotion
                          : prev.inner
                      const roots =
                        prev.roots === emotion
                          ? undefined
                          : open === 'roots'
                          ? emotion
                          : prev.roots
                      return { outer, inner, roots }
                    })
                    setOpen(null)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
