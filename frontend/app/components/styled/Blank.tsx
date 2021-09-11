import { useStyles } from '@/hooks/useStyles'
import styles from './Blank.module.sass'

export const Blank = () => <div className={useStyles(styles).blank}></div>
