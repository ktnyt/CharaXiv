import { maxVariableKey } from './DataColumn/utils'
import {
  CustomSkill,
  EXSkills,
  isSingle,
  MultiSkill,
  SingleSkill,
  SkillCategory,
  SkillGroup,
  Skills,
  Status,
} from './types'

export const formatPalette = (skills: Skills, status: Status) => {
  const formatName = (name: string) =>
    EXSkills.includes(name) ? `★${name}` : name

  const formatSingleSkill = (
    group: string,
    { name, base, bases, level }: SingleSkill,
  ) =>
    `${level}DM<=${
      ['蘇生'].includes(name)
        ? Math.ceil(status.variables[base || maxVariableKey(status, bases)] / 2)
        : level + status.variables[base || maxVariableKey(status, bases)]
    } 《${group}・${formatName(name)}》`

  const formatMultiSkill = (
    group: string,
    { name, base, bases, genres }: MultiSkill,
  ) =>
    genres
      .map(
        (genre) =>
          `${genre.level}DM<=${
            genre.level +
            status.variables[base || maxVariableKey(status, bases)]
          } 《${group}・${formatName(name)}：${genre.label}》`,
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
      `1DM<=${
        ['手当て'].includes(group.name)
          ? Math.ceil(status.variables[group.base] / 2)
          : status.variables[group.base]
      } 《＊${group.name}》`,
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
    '({共鳴}+1)DM<= 《共鳴判定・属性一致》',
    '({共鳴}*2)DM<= 《共鳴判定・完全一致》',
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
