import { ReactNode } from 'react'
import { Blank } from '@/components/styled/Blank'
import { useStyles } from '@/hooks/useStyles'
import styles from './Main.module.sass'

export interface MainProps {
  children?: ReactNode
}

export const Main = ({ children }: MainProps) => (
  <main className={useStyles(styles).main}>
    {children}
    <Blank />
  </main>
)
