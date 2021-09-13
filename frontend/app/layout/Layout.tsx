import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import styles from './Layout.module.sass'

export interface LayoutProps {
  children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <div className={styles.container}>
    <Toaster toastOptions={{ duration: 3000 }} />
    {children}
  </div>
)
