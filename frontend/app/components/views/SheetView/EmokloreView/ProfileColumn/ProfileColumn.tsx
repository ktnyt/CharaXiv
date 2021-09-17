import { useState } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Sheet, updateSheet } from '@/api/sheet'
import { Editor } from '@/components/styled/Editor'
import { IconButton } from '@/components/styled/IconButton'
import { Input } from '@/components/styled/Input'
import { Tags } from '@/components/styled/Tags'
import { Typography } from '@/components/styled/Typography'
import { useCookie } from '@/context/CookiesContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useInput } from '@/hooks/useInput'
import { useRendered } from '@/hooks/useRendered'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { ImageSection } from './ImageSection'
import styles from './ProfileColumn.module.sass'

export interface ProfileColumnProps {
  sheet: Sheet
}

export const ProfileColumn = ({ sheet }: ProfileColumnProps) => {
  const token = useCookie('token')

  const [rawName, onNameCommit] = useInput(sheet.name)
  const name = useDebounce(rawName, { delay: 500 })

  useUpdateEffect(() => {
    if (token) {
      updateSheet(sheet.id, { name }, token)
    }
  }, [sheet, name])

  const [rawRuby, onRubyCommit] = useInput(sheet.ruby)
  const ruby = useDebounce(rawRuby, { delay: 500 })

  useUpdateEffect(() => {
    if (token) {
      updateSheet(sheet.id, { ruby }, token)
    }
  }, [sheet, ruby])

  const [rawTags, setRawTags] = useState(sheet.tags)
  const tags = useDebounce(rawTags, { delay: 500 })

  useUpdateEffect(() => {
    if (token) {
      updateSheet(sheet.id, { tags }, token)
    }
  }, [sheet, tags])

  const [rawMemo, setRawMemo] = useState(sheet.memo)
  const memo = useDebounce(rawMemo, { delay: 1000 })

  useUpdateEffect(() => {
    if (token) {
      updateSheet(sheet.id, { memo }, token)
    }
  }, [sheet, memo])

  const [rawSecret, setRawSecret] = useState(sheet.secret)
  const secret = useDebounce(rawSecret, { delay: 1000 })

  useUpdateEffect(() => {
    if (token) {
      updateSheet(sheet.id, { secret }, token)
    }
  })

  const [showSecret, setShowSecret] = useState(sheet.own)

  const rendered = useRendered()

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <ImageSection
        sheetId={sheet.id}
        paths={sheet.images}
        disabled={!sheet.own}
      />

      <div>
        <Input
          variant="h1"
          placeholder="名前"
          defaultValue={sheet.name}
          disabled={!sheet.own}
          onCommit={onNameCommit}
        />
        <Input
          variant="h4"
          placeholder="よみがな"
          defaultValue={sheet.ruby}
          disabled={!sheet.own}
          onCommit={onRubyCommit}
        />
      </div>

      <div>
        <Tags
          defaultValues={sheet.tags}
          disabled={!sheet.own}
          onChangeValues={(values) => setRawTags(values)}
        />
      </div>

      <div>
        {rendered && (
          <Editor
            placeholder="公開メモ"
            defaultValue={rawMemo}
            onChange={(raw) => setRawMemo(raw)}
            disabled={!sheet.own}
          />
        )}
      </div>

      <div>
        <div className={classes.header}>
          <Typography variant="h1">秘匿メモ</Typography>

          <IconButton
            variant="outline"
            color="light"
            icon={showSecret ? faEyeSlash : faEye}
            onClick={() => setShowSecret((prev) => !prev)}
          />
        </div>

        {rendered && showSecret && (
          <Editor
            placeholder="秘匿メモ"
            defaultValue={rawSecret}
            onChange={(raw) => setRawSecret(raw)}
            disabled={!sheet.own}
          />
        )}
      </div>
    </div>
  )
}
