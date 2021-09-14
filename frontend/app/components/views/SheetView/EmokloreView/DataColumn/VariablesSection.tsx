import { Fragment, useEffect, useRef, useState } from 'react'
import { Twemoji } from '@/components/atoms/Twemoji'
import { Button } from '@/components/styled/Button'
import { Modal } from '@/components/styled/Modal'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { range } from '@/helpers/array'
import { sum } from '@/helpers/math'
import { randomElement } from '@/helpers/random'
import { useStyles } from '@/hooks/useStyles'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { ValueMonitor } from './ValueMonitor'
import styles from './VariablesSection.module.sass'
import { Status, VariableEmoji, VariableKeys, Variables } from '../types'

export interface VariablesSectionProps {
  status: Status
  disabled?: boolean
  onChange: (status: Status) => void
}

export const VariablesSection = ({
  status: init,
  disabled,
  onChange,
}: VariablesSectionProps) => {
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const [status, setStatus] = useState(init)

  useUpdateEffect(() => {
    onChangeRef.current(status)
  }, [status])

  const [openRandom, setOpenRandom] = useState(false)

  const increment = (variables: Variables): Variables => {
    if (
      sum(
        VariableKeys.filter((key) => key !== '運勢').map(
          (key) => variables[key],
        ),
      ) === 25
    ) {
      return variables
    }
    const keys = VariableKeys.filter(
      (key) => variables[key] < 6 && key !== '運勢',
    )
    const key = randomElement(keys)
    return increment({
      ...variables,
      [key]: variables[key] + 1,
    })
  }

  const randomizeAll = () => {
    setStatus((prev) => ({
      ...prev,
      variables: increment({
        身体: 1,
        器用: 1,
        精神: 1,
        五感: 1,
        知力: 1,
        魅力: 1,
        社会: 1,
        運勢: Math.floor(Math.random() * 6) + 1,
      }),
    }))
  }

  const randomizeLuck = () => {
    setStatus(({ variables, ...prev }) => ({
      ...prev,
      variables: {
        ...variables,
        運勢: Math.floor(Math.random() * 6) + 1,
      },
    }))
  }

  const value = sum(Object.values(status.variables)) - status.variables['運勢']

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <Typography variant="h1">能力値</Typography>

          <ValueMonitor
            value={value}
            base={25}
            extra={status.extra}
            onChange={(extra) => setStatus((prev) => ({ ...prev, extra }))}
          />
        </div>

        {!disabled && (
          <div>
            <Button
              variant="outline"
              color="primary"
              onClick={() => setOpenRandom(true)}
            >
              ランダム
            </Button>

            <Modal open={openRandom} handleClose={() => setOpenRandom(false)}>
              <div className={classes.random}>
                <Typography variant="h2">ランダムに決定</Typography>
                <Button
                  variant="default"
                  color="primary"
                  onClick={() => {
                    randomizeAll()
                    setOpenRandom(false)
                  }}
                >
                  全ステータス
                </Button>
                <Button
                  variant="outline"
                  color="primary"
                  onClick={() => {
                    randomizeLuck()
                    setOpenRandom(false)
                  }}
                >
                  運勢のみ
                </Button>
              </div>
            </Modal>
          </div>
        )}
      </div>

      <div className={classes.grid}>
        {VariableKeys.map((key) => (
          <Fragment key={key}>
            <Typography variant="h4">
              <Twemoji emoji={VariableEmoji[key]} />
            </Typography>

            <Typography variant="h4">{key}</Typography>

            <SlideSelector
              index={status.variables[key] - 1}
              disabled={disabled}
              onCommit={(value) => {
                setStatus((prev) => ({
                  ...prev,
                  variables: {
                    ...prev.variables,
                    [key]: value + 1,
                  },
                }))
              }}
            >
              {range(1, 6).map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </SlideSelector>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
