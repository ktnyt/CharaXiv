import { defaultSkills, defaultStatus } from './defaults'
import { Reverb, Skills, Status } from './types'
import { Sheet } from '@/api/sheet'
import { useStyles } from '@/hooks/useStyles'
import { EmotionSection, Emotions } from './EmotionSection'
import { ReverbSection } from './ReverbSection'
import { StatusSection } from './StatusSection'
import styles from './DataColumn.module.sass'

export interface DataColumnProps {
  sheet: Sheet
}

export const DataColumn = ({ sheet }: DataColumnProps) => {
  const initEmotions: Emotions =
    'emotions' in sheet.data ? sheet.data.emotions : {}

  const initReverbs: Reverb[] =
    'reverbs' in sheet.data ? sheet.data.reverbs : []

  const initStatus: Status =
    'status' in sheet.data ? sheet.data.status : defaultStatus

  const initSkills: Skills =
    'skills' in sheet.data ? sheet.data.skills : defaultSkills

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <EmotionSection
        sheetId={sheet.id}
        emotions={initEmotions}
        disabled={!sheet.own}
      />

      <ReverbSection
        sheetId={sheet.id}
        reverbs={initReverbs}
        disabled={!sheet.own}
      />

      <StatusSection
        sheetId={sheet.id}
        status={initStatus}
        skills={initSkills}
        disabled={!sheet.own}
      />
    </div>
  )
}
