export const EmotionTypes = [
  '自己顕示',
  '所有',
  '本能',
  '破壊',
  '優越感',
  '怠惰',
  '逃避',
  '好奇心',
  'スリル',
  '喜び',
  '怒り',
  '哀しみ',
  '幸福',
  '不安',
  '嫌悪',
  '恐怖',
  '嫉妬',
  '恨み',
  '正義',
  '崇拝',
  '善悪',
  '希望',
  '向上',
  '理性',
  '勝利',
  '秩序',
  '憧憬',
  '無我',
  '友情',
  '愛',
  '恋',
  '依存',
  '尊敬',
  '軽蔑',
  '庇護',
  '支配',
  '奉仕',
  '甘え',
  '後悔',
  '孤独',
  '諦観',
  '絶望',
  '否定',
  '疑念',
  '罪悪感',
  '狂気',
  '劣等感',
] as const

export type EmotionType = typeof EmotionTypes[number]

export type EmotionCategory = '欲望' | '情念' | '理想' | '関係' | '傷'

export const EmotionCategories: Record<EmotionType, EmotionCategory> = {
  自己顕示: '欲望',
  所有: '欲望',
  本能: '欲望',
  破壊: '欲望',
  優越感: '欲望',
  怠惰: '欲望',
  逃避: '欲望',
  好奇心: '欲望',
  スリル: '欲望',
  喜び: '情念',
  怒り: '情念',
  哀しみ: '情念',
  幸福: '情念',
  不安: '情念',
  嫌悪: '情念',
  恐怖: '情念',
  嫉妬: '情念',
  恨み: '情念',
  正義: '理想',
  崇拝: '理想',
  善悪: '理想',
  希望: '理想',
  向上: '理想',
  理性: '理想',
  勝利: '理想',
  秩序: '理想',
  憧憬: '理想',
  無我: '理想',
  友情: '関係',
  愛: '関係',
  恋: '関係',
  依存: '関係',
  尊敬: '関係',
  軽蔑: '関係',
  庇護: '関係',
  支配: '関係',
  奉仕: '関係',
  甘え: '関係',
  後悔: '傷',
  孤独: '傷',
  諦観: '傷',
  絶望: '傷',
  否定: '傷',
  疑念: '傷',
  罪悪感: '傷',
  狂気: '傷',
  劣等感: '傷',
}

export const getEmotionCategory = (emotion: EmotionType) =>
  EmotionCategories[emotion]

export type Emotions = {
  outer?: EmotionType
  inner?: EmotionType
  roots?: EmotionType
}

export type Reverb = {
  scenario: string
  emotion: string
  consumed: boolean
}

export const VariableKeys = [
  '身体',
  '器用',
  '精神',
  '五感',
  '知力',
  '魅力',
  '社会',
  '運勢',
] as const

export type VariableKey = typeof VariableKeys[number]

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

export type Status = {
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

export const EXSkills = ['霊感', '奥義', '射撃', '蘇生', '強運']

export type SkillBase = {
  name: string
  base?: VariableKey
  bases: VariableKey[]
}

export type Skill = SkillBase &
  (
    | {
        type: 'single'
        level: number
      }
    | {
        type: 'multi'
        genres: {
          label: string
          level: number
        }[]
      }
  )

export type CustomSkill = SkillBase & {
  level: number
}

export type SkillGroup = {
  name: string
  base: VariableKey
  skills: Skill[]
}

export type SkillCategory = {
  name: string
  groups: SkillGroup[]
}

export type Skills = {
  presets: SkillCategory[]
  custom: CustomSkill[]
  extra: number
}

export type EmokloreData = {
  emotions: Emotions
  reverbs: Reverb[]
  resonance: number
  status: Status
  skills: Skills
}
