import { Skills, Status } from './types'
import { Fragment, useState } from 'react'
import { updateSheet } from '@/api/sheet'
import { useCookie } from '@/context/CookiesContext'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { ParametersSection } from './ParametersSection'
import { SkillsSection } from './SkillsSection'
import { VariablesSection } from './VariablesSection'

export interface StatusSectionProps {
  sheetId: string
  status: Status
  skills: Skills
  disabled: boolean
}

export const StatusSection = ({
  sheetId,
  status: initStatus,
  skills: initSkills,
  disabled,
}: StatusSectionProps) => {
  const token = useCookie('token')

  const [status, setStatus] = useState(initStatus)
  useUpdateEffect(() => {
    if (!disabled && token) {
      updateSheet(sheetId, { data: { status } }, token)
    }
  }, [sheetId, status])

  const [skills, setSkills] = useState(initSkills)
  useUpdateEffect(() => {
    if (!disabled && token) {
      updateSheet(sheetId, { data: { skills } }, token)
    }
  }, [sheetId, skills])

  return (
    <Fragment>
      <VariablesSection
        status={status}
        onChange={setStatus}
        disabled={disabled}
      />

      <ParametersSection status={status} />

      <SkillsSection
        skills={skills}
        status={status}
        disabled={disabled}
        onChange={setSkills}
      />
    </Fragment>
  )
}
