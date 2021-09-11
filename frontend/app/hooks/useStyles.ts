import clsx from 'clsx'
import { kebab } from '@/helpers/case_conversion'
import { useColorScheme } from './useColorScheme'

export type Styles = { [key: string]: string }

export const useStyles = (styles: Styles): Styles => {
  const [isDark] = useColorScheme()
  return Object.fromEntries(
    Object.entries(styles)
      .filter(([key]) => key !== 'darkmode')
      .map(([key, style]) => [
        kebab.toCamel(key),
        clsx(style, isDark && 'darkmode' in styles && styles.darkmode),
      ]),
  )
}
