import { Fragment } from 'react'
import { Twemoji } from '@/components/atoms/Twemoji'
import { SlideSelector } from '@/components/styled/SlideSelector'
import { Typography } from '@/components/styled/Typography'
import { range } from '@/helpers/array'
import { useStyles } from '@/hooks/useStyles'
import styles from './ParametersSection.module.sass'
import { Status } from '../types'

export interface ParametersSectionProps {
  status: Status
}

export const ParametersSection = ({ status }: ParametersSectionProps) => {
  const parameters = [
    {
      label: 'HP',
      emoji: '❤️',
      value: status.variables['身体'] + 10,
      min: 11,
      max: 16,
    },
    {
      label: 'MP',
      emoji: '🪄',
      value: status.variables['精神'] + status.variables['知力'],
      min: 2,
      max: 12,
    },
  ]

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <Typography variant="h1" className={classes.header}>
        パラメータ
      </Typography>

      <div className={classes.grid}>
        {parameters.map(({ label, emoji, value, min, max }) => (
          <Fragment key={label}>
            <Typography variant="h4">
              <Twemoji emoji={emoji} />
            </Typography>

            <Typography variant="h4">{label}</Typography>

            <div>
              <SlideSelector index={value - min} disabled>
                {range(min, max).map((value, index) => (
                  <span key={index}>{value}</span>
                ))}
              </SlideSelector>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
