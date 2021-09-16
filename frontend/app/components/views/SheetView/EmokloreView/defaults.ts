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
            { name: '検索', bases: ['知力'], level: 0 },
            { name: '洞察', bases: ['知力'], level: 0 },
            { name: 'マッピング', bases: ['器用', '五感'], level: 0 },
            { name: '直感', bases: ['精神', '運勢'], level: 0 },
            { name: '鑑定', bases: ['五感', '知力'], level: 0 },
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
            { name: '観察眼', bases: ['五感'], level: 0 },
            { name: '聞き耳', bases: ['五感'], level: 0 },
            { name: '毒味', bases: ['五感'], level: 0 },
            { name: '危機察知', bases: ['五感', '運勢'], level: 0 },
            { name: '霊感', bases: ['精神', '運勢'], level: 0 },
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
            { name: '社交術', bases: ['社会'], level: 0 },
            { name: 'ディベート', bases: ['知力'], level: 0 },
            { name: '魅了', bases: ['魅力'], level: 0 },
            { name: '心理', bases: ['精神', '知力'], level: 0 },
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
          skills: [{ name: '専門知識', bases: ['知力'], genres: [] }],
        },
        {
          name: 'ニュース',
          base: '社会',
          skills: [
            { name: '事情通', bases: ['五感', '社会'], level: 0 },
            { name: '業界', bases: ['社会', '魅力'], genres: [] },
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
            { name: 'スピード', bases: ['身体'], level: 0 },
            { name: 'ストレングス', bases: ['身体'], level: 0 },
            { name: 'アクロバット', bases: ['身体', '器用'], level: 0 },
            { name: 'ダイブ', bases: ['身体'], level: 0 },
          ],
        },
        {
          name: '格闘',
          base: '身体',
          skills: [
            { name: '武術', bases: ['身体'], genres: [] },
            { name: '奥義', bases: ['身体', '精神', '器用'], genres: [] },
          ],
        },
        {
          name: '投擲',
          base: '器用',
          skills: [
            { name: '射撃', bases: ['器用', '五感'], genres: [] },
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
          skills: [{ name: '耐久', bases: ['身体'], level: 0 }],
        },
        {
          name: '自我',
          base: '精神',
          skills: [{ name: '根性', bases: ['精神'], level: 0 }],
        },
        {
          name: '手当て',
          base: '知力',
          skills: [
            { name: '医術', bases: ['器用', '知力'], level: 0 },
            { name: '蘇生', bases: ['知力', '精神'], level: 0 },
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
            { name: '技工', bases: ['器用'], genres: [] },
            { name: '芸術', bases: ['器用', '精神', '五感'], genres: [] },
            { name: '操縦', bases: ['器用', '五感', '知力'], genres: [] },
            { name: '暗号', bases: ['知力'], level: 0 },
            { name: '電脳', bases: ['知力'], level: 0 },
            { name: '隠匿', bases: ['器用', '社会', '運勢'], level: 0 },
          ],
        },
        {
          name: '幸運',
          base: '運勢',
          skills: [{ name: '強運', bases: ['運勢'], level: 0 }],
        },
      ],
    },
  ],
  custom: [],
  extra: 0,
}
