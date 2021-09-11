import { Sheet } from '@/api/sheet'
import { useStyles } from '@/hooks/useStyles'
import { DataColumn } from './DataColumn/DataColumn'
import { ProfileColumn } from './ProfileColumn/ProfileColumn'
import styles from './Emoklore.module.sass'

export interface EmokloreProps {
  sheet: Sheet
}

export const Emoklore = ({ sheet }: EmokloreProps) => {
  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.columnLeft}>
          <ProfileColumn sheet={sheet} />
        </div>

        <div className={classes.columnRight}>
          <DataColumn sheet={sheet} />
        </div>
      </div>
    </div>
  )
}
