import { Reverb } from './types'
import { Fragment, useState } from 'react'
import { updateSheet } from '@/api/sheet'
import { Button } from '@/components/styled/Button'
import { Confirm } from '@/components/styled/Confirm'
import { Typography } from '@/components/styled/Typography'
import { useCookie } from '@/context/CookiesContext'
import { appender, remover, replacer } from '@/helpers/array'
import { useDebounce } from '@/hooks/useDebounce'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { ReverbRow } from './ReverbRow'
import styles from './ReverbSection.module.sass'

export interface ReverbSectionProps {
  sheetId: string
  reverbs: Reverb[]
  disabled: boolean
}

export const ReverbSection = ({
  sheetId,
  reverbs: init,
  disabled,
}: ReverbSectionProps) => {
  const token = useCookie('token')

  const [rawReverbs, setReverbs] = useState(init)
  const reverbs = useDebounce(rawReverbs, { delay: 500 })
  useUpdateEffect(() => {
    if (!disabled && token) {
      updateSheet(sheetId, { data: { reverbs } }, token)
    }
  }, [reverbs, disabled])

  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <Typography variant="h1">残響</Typography>

      {rawReverbs.map((reverb, index) => (
        <Fragment key={index}>
          <ReverbRow
            reverb={reverb}
            disabled={disabled}
            onChange={(value) => setReverbs(replacer(value, index))}
            onRemove={() => setOpenRemoveDialog(true)}
          />

          <Confirm
            open={openRemoveDialog}
            onConfirm={() => {
              setReverbs(remover(index))
              setOpenRemoveDialog(false)
            }}
            onCancel={() => setOpenRemoveDialog(false)}
          >
            <Typography variant="h3">本当に残響を削除しますか？</Typography>
            この操作は元に戻せません。
          </Confirm>
        </Fragment>
      ))}

      {!disabled && (
        <div className={classes.button}>
          <Button
            variant="outline"
            color="primary"
            onClick={() =>
              setReverbs(
                appender({
                  scenario: '',
                  emotion: '',
                  consumed: false,
                } as Reverb),
              )
            }
          >
            残響を追加
          </Button>
        </div>
      )}
    </div>
  )
}
