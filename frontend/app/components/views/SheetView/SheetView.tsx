import Error from 'next/error'
import { Sheet } from '@/api/sheet'
import { EmokloreView } from './EmokloreView'

export interface SheetViewProps {
  sheet: Sheet
}

export const SheetView = ({ sheet }: SheetViewProps) => {
  switch (sheet.system) {
    case 'emoklore':
      return <EmokloreView sheet={sheet} />

    default:
      return <Error statusCode={404} />
  }
}
