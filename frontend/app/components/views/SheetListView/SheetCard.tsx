import { MouseEventHandler, useState } from 'react'
import Image from 'next/image'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { Sheet } from '@/api/sheet'
import { Confirm } from '@/components/styled/Confirm'
import { Icon } from '@/components/styled/Icon'
import { ImagePlaceholder } from '@/components/styled/ImagePlaceholder'
import { Tags } from '@/components/styled/Tags'
import { Typography } from '@/components/styled/Typography'
import { imageUrl } from '@/helpers/image_url'
import { useStyles } from '@/hooks/useStyles'
import styles from './SheetCard.module.sass'

export interface SheetCardProps {
  sheet: Sheet
  onRemove: () => void
}

export const SheetCard = ({ sheet, onRemove }: SheetCardProps) => {
  const [openMenu, setOpenMenu] = useState(false)

  const handleMenuButton: MouseEventHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenMenu(true)
  }

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      <div className={classes.image}>
        {sheet.images.length > 0 ? (
          <Image
            alt={sheet.images[0]}
            src={imageUrl(sheet.images[0])}
            layout="fill"
            objectFit="contain"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className={classes.content}>
        <Typography variant="h3">{sheet.name || '名無し'}</Typography>
        <Tags defaultValues={sheet.tags} disabled />
      </div>

      <div className={classes.menu}>
        <button className={classes.menuButton} onClick={handleMenuButton}>
          <Icon icon={faTrashAlt} />
        </button>

        <Confirm
          open={openMenu}
          onConfirm={() => {
            setOpenMenu(false)
            onRemove()
          }}
          onCancel={() => setOpenMenu(false)}
        >
          <Typography variant="h3">
            本当にキャラクターを削除しますか？
          </Typography>
          <Typography variant="body1">この操作は元に戻せません。</Typography>
        </Confirm>
      </div>
    </div>
  )
}
