import { ReactNode } from 'react'
import Link from 'next/link'
import { faLayerGroup, faMoon } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@/components/styled/Icon'
import { IconButton } from '@/components/styled/IconButton'
import { InputGroup } from '@/components/styled/InputGroup'
import { Typography } from '@/components/styled/Typography'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useStyles } from '@/hooks/useStyles'
import styles from './Header.module.sass'

export interface HeaderProps {
  children?: ReactNode
}

export const Header = ({ children }: HeaderProps) => {
  const isMounted = useIsMounted()
  const [, toggleScheme] = useColorScheme()
  const classes = useStyles(styles)

  return (
    <header className={classes.header}>
      <div>
        <Link href="/">
          <a className={classes.title}>
            <Icon icon={faLayerGroup} color="default" />
            <Typography variant="h2" color="default">
              CharaXiv
            </Typography>
          </a>
        </Link>
      </div>

      <div className={classes.controls}>
        <InputGroup>
          {children}

          <IconButton
            variant="textual"
            color="medium"
            icon={faMoon}
            onClick={() => isMounted() && toggleScheme()}
          />
        </InputGroup>
      </div>
    </header>
  )
}
