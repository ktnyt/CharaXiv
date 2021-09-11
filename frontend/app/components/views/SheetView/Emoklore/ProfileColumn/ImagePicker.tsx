import Image from 'next/image'
import { imageUrl } from '@/helpers/image_url'
import { useStyles } from '@/hooks/useStyles'
import styles from './ImagePicker.module.sass'

export interface ImagePickerProps {
  paths: string[]
  onSelect: (index: number) => void
}

export const ImagePicker = ({ paths, onSelect }: ImagePickerProps) => {
  const classes = useStyles(styles)
  return (
    <div className={classes.container}>
      {paths.map((path, key) => (
        <div key={key} onClick={() => onSelect(key)}>
          <Image
            alt={path}
            src={imageUrl(path)}
            layout="fill"
            objectFit="contain"
          />
        </div>
      ))}
    </div>
  )
}
