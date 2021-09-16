import { Fragment, useState } from 'react'
import { updateSheet } from '@/api/sheet'
import { useCookie } from '@/context/CookiesContext'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { ParametersSection } from './ParametersSection'
import { SkillsSection } from './SkillsSection'
import { VariablesSection } from './VariablesSection'
import { Skills, Status } from '../types'

export interface StatusSectionProps {
  sheetId: string
  status: Status
  skills: Skills
  disabled: boolean
}

export const StatusSection = ({
  sheetId,
  status: initStatus,
  skills,
  disabled,
}: StatusSectionProps) => {
  const token = useCookie('token')

  const [status, setStatus] = useState(initStatus)
  useUpdateEffect(() => {
    if (!disabled && token) {
      updateSheet(sheetId, { data: { status } }, token)
    }
  }, [sheetId, status])

  return (
    <Fragment>
      <VariablesSection
        status={status}
        disabled={disabled}
        onChange={(nextStatus) => setStatus(nextStatus)}
      />

      <ParametersSection status={status} />

      <SkillsSection
        sheetId={sheetId}
        skills={skills}
        status={status}
        disabled={disabled}
      />
    </Fragment>
  )
}
