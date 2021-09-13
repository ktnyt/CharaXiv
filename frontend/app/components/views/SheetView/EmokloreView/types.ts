import { Sheet } from '@/api/sheet'

// prettier-ignore
export type EmotionType =
  | '自己顕示' | '所有' | '本能' | '破壊' | '優越感' | '怠惰' | '逃避' | '好奇心'
  | 'スリル' | '喜び' | '怒り' | '哀しみ' | '幸福' | '不安' | '嫌悪' | '恐怖' | '嫉妬'
  | '恨み' | '正義' | '崇拝' | '善悪' | '希望' | '向上' | '理性' | '勝利' | '秩序'
  | '憧憬' | '無我' | '友情' | '愛' | '恋' | '依存' | '尊敬' | '軽蔑' | '庇護'
  | '支配' | '奉仕' | '甘え' | '後悔' | '孤独' | '諦観' | '絶望' | '否定' | '疑念'
  | '罪悪感' | '狂気' | '劣等感'

// prettier-ignore
export const EmotionTypes: EmotionType[] = [
  '自己顕示', '所有', '本能', '破壊', '優越感', '怠惰', '逃避', '好奇心', 'スリル',
  '喜び', '怒り', '哀しみ', '幸福', '不安', '嫌悪', '恐怖', '嫉妬', '恨み', '正義',
  '崇拝', '善悪', '希望', '向上', '理性', '勝利', '秩序', '憧憬', '無我', '友情', '愛',
  '恋', '依存', '尊敬', '軽蔑', '庇護', '支配', '奉仕', '甘え', '後悔', '孤独', '諦観',
  '絶望', '否定', '疑念', '罪悪感', '狂気', '劣等感',
]

export type EmotionCategory =
  | 'desire'
  | 'passion'
  | 'ideal'
  | 'relation'
  | 'wound'

// prettier-ignore
export const EmotionCategories: Record<EmotionType, EmotionCategory> = {
  自己顕示: 'desire', 所有: 'desire', 本能: 'desire', 破壊: 'desire',
  優越感: 'desire', 怠惰: 'desire', 逃避: 'desire', 好奇心: 'desire',
  スリル: 'desire', 喜び: 'passion', 怒り: 'passion', 哀しみ: 'passion',
  幸福: 'passion', 不安: 'passion', 嫌悪: 'passion', 恐怖: 'passion',
  嫉妬: 'passion', 恨み: 'passion', 正義: 'ideal', 崇拝: 'ideal', 善悪: 'ideal',
  希望: 'ideal', 向上: 'ideal', 理性: 'ideal', 勝利: 'ideal', 秩序: 'ideal',
  憧憬: 'ideal', 無我: 'ideal', 友情: 'relation', 愛: 'relation', 恋: 'relation',
  依存: 'relation', 尊敬: 'relation', 軽蔑: 'relation', 庇護: 'relation',
  支配: 'relation', 奉仕: 'relation', 甘え: 'relation', 後悔: 'wound',
  孤独: 'wound', 諦観: 'wound', 絶望: 'wound', 否定: 'wound', 疑念: 'wound',
  罪悪感: 'wound', 狂気: 'wound', 劣等感: 'wound',
}

export const getEmotionCategory = (emotion: EmotionType) =>
  EmotionCategories[emotion]

export interface Emotions {
  outer?: EmotionType
  inner?: EmotionType
  roots?: EmotionType
}

export interface Reverb {
  scenario: string
  emotion: string
  consumed: boolean
}

// prettier-ignore
export type VariableKey =
  | '身体' | '器用' | '精神' | '五感' | '知力' | '魅力' | '社会' | '運勢'

// prettier-ignore
export const VariableKeys: VariableKey[] = [
  '身体', '器用', '精神', '五感', '知力', '魅力', '社会', '運勢',
]

export const VariableEmoji: Record<VariableKey, string> = {
  身体: '💪',
  器用: '👌',
  精神: '💭',
  五感: '👂',
  知力: '💡',
  魅力: '💖',
  社会: '🤝',
  運勢: '🎲',
}

export type Variables = Record<VariableKey, number>

export interface Status {
  variables: Variables
  extra: number
}

// prettier-ignore
export type SkillCategoryValue =
  | '調査' | '知覚' | '交渉' | '知識' | 'ニュース' | '運動' | '格闘' | '投擲' | '生存'
  | '自我' | '手当て' | '細工' | '幸運'

// prettier-ignore
export const SkillCategoryValues: SkillCategoryValue[] = [
  '調査', '知覚', '交渉', '知識', 'ニュース', '運動', '格闘', '投擲', '生存', '自我',
  '手当て', '細工', '幸運',
]

export interface SingleSkill {
  name: string
  base: VariableKey[]
  level: number
  ex: boolean
}

export interface SkillGenre {
  label: string
  level: number
}

export interface MultiSkill {
  name: string
  base: VariableKey[]
  genres: SkillGenre[]
  ex: boolean
}

export interface CustomSkill {
  name: string
  base: VariableKey
  level: number
}

export const isSingle = (
  skill: SingleSkill | MultiSkill,
): skill is SingleSkill => {
  return (skill as MultiSkill).genres === undefined
}

export interface SkillGroup {
  name: string
  base: VariableKey
  skills: (SingleSkill | MultiSkill)[]
}

export interface SkillCategory {
  name: string
  groups: SkillGroup[]
}

export interface Skills {
  presets: SkillCategory[]
  custom: CustomSkill[]
  extra: number
}

export type EmokloreSheet = Omit<Sheet, 'data'> & {
  data: {
    emotions: Emotions
    reverbs: Reverb[]
    status: Status
    skills: Skills
  }
}
