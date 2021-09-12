import {
  CustomSkill,
  isSingle,
  MultiSkill,
  SingleSkill,
  SkillCategory,
  SkillGroup,
  Skills,
  Status,
} from './types'
import { maxVariable } from './utils'

export const formatPalette = (skills: Skills, status: Status) => {
  const formatSingleSkill = (group: string, skill: SingleSkill) =>
    `${skill.level}DM<=${
      skill.level + maxVariable(status, skill.base)
    } 《${group}・${skill.name}》`

  const formatMultiSkill = (group: string, skill: MultiSkill) =>
    skill.genres
      .map(
        (genre) =>
          `${genre.level}DM<=${
            genre.level + maxVariable(status, skill.base)
          } 《${group}・${skill.name}：${genre.label}》`,
      )
      .join('\n')

  const formatSkill = (group: string) => (skill: SingleSkill | MultiSkill) =>
    isSingle(skill)
      ? formatSingleSkill(group, skill)
      : formatMultiSkill(group, skill)

  const filterMultiSkill = ({ genres, ...skill }: MultiSkill): MultiSkill => ({
    ...skill,
    genres: genres.filter(({ level }) => level > 0),
  })

  const filterSkills = (skills: (SingleSkill | MultiSkill)[]) =>
    skills
      .map((skill) => (isSingle(skill) ? skill : filterMultiSkill(skill)))
      .filter((skill) =>
        isSingle(skill) ? skill.level > 0 : skill.genres.length > 0,
      )

  const formatGroup = (group: SkillGroup) =>
    [
      `1DM<=${status.variables[group.base]} 《＊${group.name}》`,
      ...filterSkills(group.skills).map(formatSkill(group.name)),
    ].join('\n')

  const formatCategory = (category: SkillCategory) =>
    [`【${category.name}】`, ...category.groups.map(formatGroup)].join('\n')

  const formatCustomSkill = (skill: CustomSkill) =>
    `${skill.level}DM<=${
      skill.level + status.variables[skill.base]
    } 《その他・${skill.name}》`

  const filterCustomSkills = (skills: CustomSkill[]) =>
    skills.filter(({ level }) => level > 0)

  return [
    '【共鳴】',
    '{共鳴}DM<= 《共鳴判定》',
    '{共鳴}+1DM<= 《共鳴判定・属性一致》',
    '{共鳴}*2DM<= 《共鳴判定・完全一致》',
    ...skills.presets.map(formatCategory),
    '【その他】',
    ...filterCustomSkills(skills.custom).map(formatCustomSkill),
    '【ステータス】',
    ':HP-1',
    ':HP+1',
    ':HP=',
    ':MP-1',
    ':MP+1',
    ':MP=',
    ':共鳴+1',
    ':共鳴-1',
    ':共鳴=',
  ].join('\n')
}
