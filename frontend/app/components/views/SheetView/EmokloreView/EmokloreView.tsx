import { defaultSkills, defaultStatus } from './defaults'
import {
  EmokloreSheet,
  Emotions,
  Reverb,
  Skills,
  Status,
  VariableKeys,
} from './types'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { draftjsToMd } from 'draftjs-md-converter'
import { faCode, faLink, faPalette } from '@fortawesome/free-solid-svg-icons'
import { getSheet, Sheet } from '@/api/sheet'
import { IconButton } from '@/components/styled/IconButton'
import { useHref } from '@/hooks/useHref'
import { useStyles } from '@/hooks/useStyles'
import { Header } from '@/layout/Header'
import { Layout } from '@/layout/Layout'
import { Main } from '@/layout/Main'
import { DataColumn } from './DataColumn/DataColumn'
import { ProfileColumn } from './ProfileColumn/ProfileColumn'
import { formatPalette } from './palette'
import styles from './Emoklore.module.sass'

export interface EmokloreViewProps {
  sheet: Sheet
}

const asEmoklore = (sheet: Sheet): EmokloreSheet => {
  const emotions: Emotions = 'emotions' in sheet.data ? sheet.data.emotions : {}

  const reverbs: Reverb[] = 'reverbs' in sheet.data ? sheet.data.reverbs : []

  const status: Status =
    'status' in sheet.data ? sheet.data.status : defaultStatus

  console.log(status)

  const skills: Skills =
    'skills' in sheet.data ? sheet.data.skills : defaultSkills

  return {
    ...sheet,
    data: {
      emotions,
      reverbs,
      status,
      skills,
    },
  }
}

const formatCcfolia = (sheet: EmokloreSheet, link: string) =>
  JSON.stringify({
    kind: 'character',
    data: {
      name: sheet.name,
      initiative: 0,
      memo: draftjsToMd(sheet.memo),
      externalUrl: link,
      params: VariableKeys.map((label) => ({
        label,
        value: String(sheet.data.status.variables[label]),
      })),
      status: [
        {
          label: 'HP',
          value: sheet.data.status.variables['身体'] + 10,
          max: sheet.data.status.variables['身体'] + 10,
        },
        {
          label: 'MP',
          value:
            sheet.data.status.variables['精神'] +
            sheet.data.status.variables['知力'],
          max:
            sheet.data.status.variables['精神'] +
            sheet.data.status.variables['知力'],
        },
        {
          label: '共鳴',
          value: 1,
          max: 9,
        },
      ],
      commands: formatPalette(sheet.data.skills, sheet.data.status),
    },
  })

export const EmokloreView = ({ sheet: init }: EmokloreViewProps) => {
  const sheet = asEmoklore(init)
  const link = useHref()

  const refresh = async (callback: (sheet: EmokloreSheet) => void) => {
    const res = await getSheet(sheet.id)
    if (typeof res !== 'number') {
      callback(res)
    }
  }

  const copyLink = () => {
    copy(link)
    toast.success('リンクをコピーしました。')
  }

  const copyPalette = () =>
    toast.promise(
      refresh((sheet) => {
        copy(formatPalette(sheet.data.skills, sheet.data.status))
      }),
      {
        loading: 'チャットパレットをコピーしています。',
        success: 'チャットパレットをコピーしました。',
        error: '内部エラーが発生しました。',
      },
    )

  const copyCcfolia = () =>
    toast.promise(
      refresh((sheet) => {
        copy(formatCcfolia(sheet, link))
      }),
      {
        loading: 'CCFolia形式でコピーしています。',
        success: 'CCFolia形式でコピーしました。',
        error: '内部エラーが発生しました。',
      },
    )

  const classes = useStyles(styles)

  return (
    <Layout>
      <Header>
        <IconButton
          icon={faLink}
          color="light"
          variant="outline"
          onClick={copyLink}
        />

        <IconButton
          icon={faCode}
          color="primary"
          variant="outline"
          onClick={copyCcfolia}
        />

        <IconButton
          icon={faPalette}
          color="primary"
          variant="default"
          onClick={copyPalette}
        />
      </Header>

      <Main>
        <div className={classes.container}>
          <div className={classes.content}>
            <div className={classes.columnLeft}>
              <ProfileColumn sheet={sheet} />
            </div>

            <div className={classes.columnRight}>
              <DataColumn sheet={sheet} />
            </div>
          </div>
        </div>
      </Main>
    </Layout>
  )
}
