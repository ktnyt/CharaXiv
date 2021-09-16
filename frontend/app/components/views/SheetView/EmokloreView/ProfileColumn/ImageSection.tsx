import { ChangeEvent, Fragment, useRef, useState } from 'react'
import Image from 'next/image'
import {
  faChevronLeft,
  faChevronRight,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { removeImage, uploadImage } from '@/api/image'
import { Click } from '@/components/atoms/Click'
import { Square } from '@/components/atoms/Square'
import { Alert } from '@/components/styled/Alert'
import { Button } from '@/components/styled/Button'
import { Carousel } from '@/components/styled/Carousel'
import { Confirm } from '@/components/styled/Confirm'
import { IconButton } from '@/components/styled/IconButton'
import { ImagePlaceholder } from '@/components/styled/ImagePlaceholder'
import { Typography } from '@/components/styled/Typography'
import { useCookie } from '@/context/CookiesContext'
import { imageUrl } from '@/helpers/image_url'
import { useStyles } from '@/hooks/useStyles'
import { ImagePicker } from './ImagePicker'
import styles from './ImageSection.module.sass'

const isNot =
  <T extends unknown>(value: T) =>
  (arg: T) =>
    value !== arg

interface State {
  paths: string[]
  index: number
  updating: boolean
}

export interface ImageSectionProps {
  sheetId: string
  paths: string[]
  disabled: boolean
}

export const ImageSection = (props: ImageSectionProps) => {
  const [state, setState] = useState<State>({
    paths: props.paths,
    index: 0,
    updating: false,
  })

  const token = useCookie('token')

  const fileInputRef = useRef<HTMLInputElement>(null!)
  const openFileInput = () => fileInputRef.current.click()

  const prevImage = () =>
    setState((prev) => ({
      ...prev,
      index: (prev.index + prev.paths.length - 1) % prev.paths.length,
    }))

  const nextImage = () =>
    setState((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.paths.length,
    }))

  const [openImagePicker, setOpenImagePicker] = useState(false)

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    event.preventDefault()
    if (event.target.files && token) {
      const image = event.target.files[0]
      setState(({ paths, index }) => ({ paths, index, updating: true }))
      const path = await uploadImage(props.sheetId, image, token).catch(
        () => null,
      )
      setState((prev) => {
        const paths = path === null ? prev.paths : [...prev.paths, path]
        const index = paths.length - 1
        return { paths, index, updating: false }
      })
      fileInputRef.current.value = ''
    }
  }

  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)

  const handleRemove = async () => {
    if (state.paths.length > 0 && token) {
      const path = state.paths[state.index]
      setState(({ paths, index }) => ({ paths, index, updating: true }))
      const flag = await removeImage(props.sheetId, path, token).catch(
        () => false,
      )
      setState((prev) => {
        const paths = flag ? prev.paths.filter(isNot(path)) : prev.paths
        const index = Math.min(prev.index, paths.length - 1)
        return { paths, index, updating: false }
      })
    }
  }

  const classes = useStyles(styles)

  return (
    <div className={classes.container}>
      {state.paths.length > 0 ? (
        <Click
          onClick={() => setOpenImagePicker(true)}
          render={(props) => (
            <Square className={classes.imageContainer} {...props}>
              <Carousel
                index={state.index}
                onChange={(index) => setState((prev) => ({ ...prev, index }))}
              >
                {state.paths.map((path, index) => (
                  <div key={index} className={classes.image}>
                    <Square>
                      <div className={classes.wrap}>
                        <Image alt={path} src={imageUrl(path)} layout="fill" />
                      </div>
                    </Square>
                  </div>
                ))}
              </Carousel>
            </Square>
          )}
        />
      ) : (
        <ImagePlaceholder />
      )}

      <Alert
        open={openImagePicker}
        confirm="閉じる"
        onConfirm={() => setOpenImagePicker(false)}
      >
        <div>
          <div style={{ marginLeft: '8px', marginBottom: '8px' }}>
            <Typography variant="h3">画像一覧</Typography>
          </div>

          <ImagePicker
            paths={state.paths}
            onSelect={(index) => {
              setState((prev) => ({ ...prev, index }))
              setOpenImagePicker(false)
            }}
          />
        </div>
      </Alert>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />

      <div className={classes.controls}>
        <div>
          <IconButton
            variant="default"
            color="light"
            icon={faChevronLeft}
            disabled={state.updating || state.paths.length < 2}
            onClick={prevImage}
          />
        </div>

        {!props.disabled ? (
          <Fragment>
            <div>
              <IconButton
                color="danger"
                variant="outline"
                icon={faTrashAlt}
                disabled={state.updating || state.paths.length === 0}
                onClick={() => setOpenRemoveDialog(true)}
              />
            </div>

            <div>
              <Button
                color="primary"
                variant="outline"
                disabled={state.updating}
                onClick={openFileInput}
                fullWidth
              >
                画像を追加
              </Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div></div>
            <div></div>
          </Fragment>
        )}

        <div>
          <IconButton
            variant="default"
            color="light"
            icon={faChevronRight}
            disabled={state.updating || state.paths.length < 2}
            onClick={nextImage}
          />
        </div>
      </div>

      <Confirm
        open={openRemoveDialog}
        onConfirm={() => {
          handleRemove()
          setOpenRemoveDialog(false)
        }}
        onCancel={() => setOpenRemoveDialog(false)}
      >
        <Typography variant="h3">本当に画像を削除しますか？</Typography>
        この操作は元に戻せません。
      </Confirm>
    </div>
  )
}
