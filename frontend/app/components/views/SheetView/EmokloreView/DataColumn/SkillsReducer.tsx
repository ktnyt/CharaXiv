import { remove } from 'lodash'
import { append, swap } from '@/helpers/array'
import {
  isSingle,
  MultiSkill,
  SingleSkill,
  Skills,
  VariableKey,
} from '../types'

const changeSkillBase =
  <Skill extends SingleSkill | MultiSkill>(base: VariableKey) =>
  (skill: Skill): Skill => ({
    ...skill,
    base,
  })

const changeSkillLevel =
  (level: number) =>
  ({ name, bases, base }: SingleSkill): SingleSkill => ({
    name,
    bases,
    base,
    level,
  })

const changeGenreLevel =
  (index: number, level: number) =>
  ({ name, bases, base, genres }: MultiSkill): MultiSkill => ({
    name,
    bases,
    base,
    genres: swap(genres, ({ label }) => ({ label, level }), index),
  })

const changeGenreLabel =
  (index: number, label: string) =>
  ({ name, bases, base, genres }: MultiSkill): MultiSkill => ({
    name,
    bases,
    base,
    genres: swap(genres, ({ level }) => ({ label, level }), index),
  })

const identity = <T extends unknown>(arg: T): T => arg

const modifySkill = (
  { presets, custom, extra }: Skills,
  skillName: string,
  single: (skill: SingleSkill) => SingleSkill,
  multi: (skill: MultiSkill) => MultiSkill,
): Skills => ({
  custom,
  extra,
  presets: presets.map(({ name, groups }) => ({
    name,
    groups: groups.map(({ name, base, skills }) => ({
      name,
      base,
      skills: skills.map((skill) =>
        skill.name === skillName
          ? isSingle(skill)
            ? single(skill)
            : multi(skill)
          : skill,
      ),
    })),
  })),
})

const modifySingleSkill = (
  skills: Skills,
  name: string,
  mod: (skill: SingleSkill) => SingleSkill,
) => modifySkill(skills, name, mod, identity)

const modifyMultiSkill = (
  skills: Skills,
  name: string,
  mod: (skill: MultiSkill) => MultiSkill,
) => modifySkill(skills, name, identity, mod)

export type SkillsAction =
  | { type: 'skill-base'; name: string; base: VariableKey }
  | { type: 'skill-level'; name: string; level: number }
  | { type: 'create-genre'; name: string }
  | { type: 'delete-genre'; name: string; index: number }
  | { type: 'genre-label'; name: string; index: number; label: string }
  | { type: 'genre-level'; name: string; index: number; level: number }
  | { type: 'extra'; extra: number }
  | { type: 'create-custom' }
  | { type: 'delete-custom'; index: number }
  | { type: 'custom-name'; index: number; name: string }
  | { type: 'custom-base'; index: number; base: VariableKey }
  | { type: 'custom-level'; index: number; level: number }

export const skillsReducer = (skills: Skills, action: SkillsAction): Skills => {
  switch (action.type) {
    case 'skill-base': {
      const { name, base } = action
      return modifySkill(
        skills,
        name,
        changeSkillBase(base),
        changeSkillBase(base),
      )
    }

    case 'skill-level': {
      const { name, level } = action
      return modifySingleSkill(skills, name, changeSkillLevel(level))
    }

    case 'create-genre': {
      const { name } = action
      return modifyMultiSkill(skills, name, ({ genres, ...skill }) => ({
        ...skill,
        genres: append(genres, { label: '', level: 0 }),
      }))
    }

    case 'delete-genre': {
      const { name, index } = action
      return modifyMultiSkill(skills, name, ({ genres, ...skill }) => ({
        ...skill,
        genres: remove(genres, index),
      }))
    }

    case 'genre-label': {
      const { name, index, label } = action
      return modifyMultiSkill(skills, name, changeGenreLabel(index, label))
    }

    case 'genre-level': {
      const { name, index, level } = action
      return modifyMultiSkill(skills, name, changeGenreLevel(index, level))
    }

    case 'create-custom': {
      return {
        ...skills,
        custom: append(skills.custom, { name: '', base: '身体', level: 0 }),
      }
    }

    case 'delete-custom': {
      const { index } = action
      return {
        ...skills,
        custom: remove(skills.custom, index),
      }
    }

    case 'custom-name': {
      const { index, name } = action
      return {
        ...skills,
        custom: swap(
          skills.custom,
          ({ base, level }) => ({ name, base, level }),
          index,
        ),
      }
    }

    case 'custom-base': {
      const { index, base } = action
      return {
        ...skills,
        custom: swap(
          skills.custom,
          ({ name, level }) => ({ name, base, level }),
          index,
        ),
      }
    }

    case 'custom-level': {
      const { index, level } = action
      return {
        ...skills,
        custom: swap(
          skills.custom,
          ({ name, base }) => ({ name, base, level }),
          index,
        ),
      }
    }

    case 'extra':
      const { extra } = action
      return { ...skills, extra }

    default:
      return { ...skills }
  }
}
