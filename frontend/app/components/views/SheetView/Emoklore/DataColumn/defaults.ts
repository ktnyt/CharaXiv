import { Skills, Status } from './types'

export const defaultStatus: Status = {
  variables: {
    身体: 1,
    器用: 1,
    精神: 1,
    五感: 1,
    知力: 1,
    魅力: 1,
    社会: 1,
    運勢: 1,
  },
  extra: 0,
}

// prettier-ignore
export const defaultSkills: Skills = {
  presets: [
    {
      name: '調査系',
      groups: [
        {
          name: '調査',
          base: '器用',
          skills: [
            { name: '検索', base: ['知力'], level: 0, ex: false },
            { name: '洞察', base: ['知力'], level: 0, ex: false },
            { name: 'マッピング', base: ['器用', '五感'], level: 0, ex: false },
            { name: '直感', base: ['精神', '運勢'], level: 0, ex: false },
            { name: '鑑定', base: ['五感', '知力'], level: 0, ex: false },
          ],
        },
      ],
    },
    {
      name: '知覚系',
      groups: [
        {
          name: '知覚',
          base: '五感',
          skills: [
            { name: '観察眼', base: ['五感'], level: 0, ex: false },
            { name: '聞き耳', base: ['五感'], level: 0, ex: false },
            { name: '毒味', base: ['五感'], level: 0, ex: false },
            { name: '危機察知', base: ['五感', '運勢'], level: 0, ex: false },
            { name: '霊感', base: ['精神', '運勢'], level: 0, ex: false },
          ],
        },
      ],
    },
    {
      name: '交渉系',
      groups: [
        {
          name: '交渉',
          base: '魅力',
          skills: [
            { name: '社交術', base: ['社会'], level: 0, ex: false },
            { name: 'ディベート', base: ['知力'], level: 0, ex: false },
            { name: '魅了', base: ['魅力'], level: 0, ex: false },
            { name: '心理', base: ['精神', '知力'], level: 0, ex: false },
          ],
        },
      ],
    },
    {
      name: '情報系',
      groups: [
        {
          name: '知識',
          base: '知力',
          skills: [{ name: '専門知識', base: ['知力'], ex: false, genres: [] }],
        },
        {
          name: 'ニュース',
          base: '社会',
          skills: [
            { name: '事情通', base: ['五感', '社会'], level: 0, ex: false },
            { name: '業界', base: ['社会', '魅力'], ex: false, genres: [] },
          ],
        },
      ],
    },
    {
      name: '運動系',
      groups: [
        {
          name: '運動',
          base: '身体',
          skills: [
            { name: 'スピード', base: ['身体'], level: 0, ex: false },
            { name: 'ストレングス', base: ['身体'], level: 0, ex: false },
            { name: 'アクロバット', base: ['身体', '器用'], level: 0, ex: false },
            { name: 'ダイブ', base: ['身体'], level: 0, ex: false },
          ],
        },
        {
          name: '格闘',
          base: '身体',
          skills: [
            { name: '武術', base: ['身体'], ex: false, genres: [] },
            { name: '奥義', base: ['身体', '精神', '器用'], ex: true, genres: [] },
          ],
        },
        {
          name: '投擲',
          base: '器用',
          skills: [
            { name: '射撃', base: ['器用', '五感'], ex: true, genres: [] },
          ],
        },
      ],
    },
    {
      name: '生存系',
      groups: [
        {
          name: '生存',
          base: '身体',
          skills: [{ name: '耐久', base: ['身体'], level: 0, ex: false }],
        },
        {
          name: '自我',
          base: '精神',
          skills: [{ name: '根性', base: ['精神'], level: 0, ex: false }],
        },
        {
          name: '手当て',
          base: '知力',
          skills: [
            { name: '医術', base: ['器用', '知力'], level: 0, ex: false },
            { name: '蘇生', base: ['知力', '精神'], level: 0, ex: false },
          ],
        },
      ],
    },
    {
      name: '特殊',
      groups: [
        {
          name: '細工',
          base: '器用',
          skills: [
            { name: '技工', base: ['器用'], ex: false, genres: [] },
            { name: '芸術', base: ['器用', '精神', '五感'], ex: false, genres: [] },
            { name: '操縦', base: ['器用', '五感', '知力'], ex: false, genres: [] },
            { name: '暗号', base: ['知力'], level: 0, ex: false },
            { name: '電脳', base: ['知力'], level: 0, ex: false },
            { name: '隠匿', base: ['器用', '社会', '運勢'], level: 0, ex: false },
          ],
        },
        {
          name: '幸運',
          base: '運勢',
          skills: [{ name: '強運', base: ['運勢'], level: 0, ex: true }],
        },
      ],
    },
  ],
  custom: [],
  extra: 0,
}
