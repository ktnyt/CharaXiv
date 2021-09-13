import { useStyles } from '@/hooks/useStyles'
import { EmotionSection } from './EmotionSection'
import { ReverbSection } from './ReverbSection'
import { StatusSection } from './StatusSection'
import styles from './DataColumn.module.sass'
import { EmokloreSheet } from '../types'

export interface DataColumnProps {
  sheet: EmokloreSheet
}

export const DataColumn = ({ sheet }: DataColumnProps) => {
  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <EmotionSection
        sheetId={sheet.id}
        emotions={sheet.data.emotions}
        disabled={!sheet.own}
      />

      <ReverbSection
        sheetId={sheet.id}
        reverbs={sheet.data.reverbs}
        disabled={!sheet.own}
      />

      <StatusSection
        sheetId={sheet.id}
        status={sheet.data.status}
        skills={sheet.data.skills}
        disabled={!sheet.own}
      />
    </div>
  )
}
