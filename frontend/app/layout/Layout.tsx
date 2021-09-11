import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Blank } from '@/components/styled/Blank'
import { useStyles } from '@/hooks/useStyles'
import { Header } from './Header'
import styles from './Layout.module.sass'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <div className={styles.container}>
    <Toaster toastOptions={{ duration: 3000 }} />
    <Header />
    <main className={useStyles(styles).main}>
      {children}
      <Blank />
    </main>
  </div>
)
