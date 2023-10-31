import { ButtonColor } from "@charaxiv/components/Button";

// prettier-ignore
export const EMOTION_TYPES = [
  "自己顕示", "所有", "本能", "破壊", "優越感", "怠惰", "逃避", "好奇心", "スリル",
  "喜び", "怒り", "哀しみ", "幸福", "不安", "嫌悪", "恐怖", "嫉妬", "恨み",
  "正義", "崇拝", "善悪", "希望", "向上", "理性", "勝利", "秩序", "憧憬", "無我",
  "友情", "愛", "恋", "依存", "尊敬", "軽蔑", "庇護", "支配", "奉仕", "甘え",
  "後悔", "孤独", "諦観", "絶望", "否定", "疑念", "罪悪感", "狂気", "劣等感",
] as const;

export type EmotionType = (typeof EMOTION_TYPES)[number];

export type EmotionCategory = "欲望" | "情念" | "理想" | "関係" | "傷";

// prettier-ignore
export const EMOTION_CATEGORY_MAP: Record<EmotionType, EmotionCategory> = {
  自己顕示: "欲望", 所有: "欲望", 本能: "欲望", 破壊: "欲望", 優越感: "欲望", 怠惰: "欲望", 逃避: "欲望", 好奇心: "欲望", スリル: "欲望",
  喜び: "情念", 怒り: "情念", 哀しみ: "情念", 幸福: "情念", 不安: "情念", 嫌悪: "情念", 恐怖: "情念", 嫉妬: "情念", 恨み: "情念",
  正義: "理想", 崇拝: "理想", 善悪: "理想", 希望: "理想", 向上: "理想", 理性: "理想", 勝利: "理想", 秩序: "理想", 憧憬: "理想", 無我: "理想",
  友情: "関係", 愛: "関係", 恋: "関係", 依存: "関係", 尊敬: "関係", 軽蔑: "関係", 庇護: "関係", 支配: "関係", 奉仕: "関係", 甘え: "関係",
  後悔: "傷", 孤独: "傷", 諦観: "傷", 絶望: "傷", 否定: "傷", 疑念: "傷", 罪悪感: "傷", 狂気: "傷", 劣等感: "傷",
};

export const EMOTION_CATEGORY_COLOR: Record<EmotionCategory, ButtonColor> = {
  欲望: "purple",
  情念: "yellow",
  理想: "blue",
  関係: "green",
  傷: "red",
};

export const EMOTION_KEYS = ["outer", "inner", "roots"] as const;

export type EmotionKey = (typeof EMOTION_KEYS)[number];

export const EMOTION_KEY_LABEL: { [key in EmotionKey]: string } = {
  outer: "表",
  inner: "裏",
  roots: "ルーツ",
};

export type Emotions = { [key in EmotionKey]: EmotionType };

export type Reverb = {
  scenario: string;
  emotion: string;
  consumed: boolean;
};

export const VARIABLE_KEYS = [
  "身体",
  "器用",
  "精神",
  "五感",
  "知力",
  "魅力",
  "社会",
  "運勢",
] as const;

export type VariableKey = (typeof VARIABLE_KEYS)[number];

export const VARIABLE_EMOJI: Record<VariableKey, string> = {
  身体: "💪",
  器用: "👌",
  精神: "💭",
  五感: "👂",
  知力: "💡",
  魅力: "💖",
  社会: "🤝",
  運勢: "🎲",
};

export type Variables = Record<VariableKey, number>;

export const PARAMETER_KEYS = ["共鳴", "HP", "MP"] as const;

export type ParameterKey = (typeof PARAMETER_KEYS)[number];

export const PARAMETER_EMOJI: Record<ParameterKey, string> = {
  共鳴: "🔔",
  HP: "❤️",
  MP: "🪄",
};

export type ParameterFormula = (variables: Variables) => number;

export const PARAMETER_FORMULA: Record<ParameterKey, ParameterFormula> = {
  共鳴: (variables) => 10,
  HP: (variables) => variables["身体"] + 10,
  MP: (variables) => variables["精神"] + variables["知力"],
};

export const PARAMETER_RANGE: Record<ParameterKey, [number, number]> = {
  共鳴: [10, 10],
  HP: [11, 16],
  MP: [2, 12],
};

export const PARAMETER_DEFAULT_ZERO: Record<ParameterKey, boolean> = {
  共鳴: true,
  HP: false,
  MP: false,
};

export type Parameters = Record<ParameterKey, number>;

export type Status = {
  variables: Variables;
  parameters: Partial<Parameters>;
  extra: number;
};

export const SKILL_CATEGORY_VALUES = [
  "調査",
  "知覚",
  "交渉",
  "知識",
  "ニュース",
  "運動",
  "格闘",
  "投擲",
  "生存",
  "自我",
  "手当て",
  "細工",
  "幸運",
] as const;

export type SkillCategoryValue = (typeof SKILL_CATEGORY_VALUES)[number];

export type SkillBase = {
  name: string;
  exskill: boolean;
};

export type SingleSkill = SkillBase & {
  type: "single";
  level: number;
  bases: VariableKey[];
};

export type SkillGenre = {
  label: string;
  level: number;
};

export type MultiSkill = SkillBase & {
  type: "multi";
  genres: SkillGenre[];
  bases: VariableKey[];
};

export type Skill = SingleSkill | MultiSkill;

export type CustomSkill = SkillBase & {
  level: number;
  base: VariableKey;
};

export type SkillGroup = {
  name: string;
  base: VariableKey;
  skills: Skill[];
};

export type SkillCategory = {
  name: string;
  groups: SkillGroup[];
};

export type Skills = {
  presets: SkillCategory[];
  custom: CustomSkill[];
  extra: number;
};

export type EmokloreData = {
  emotions: Partial<Emotions>;
  reverbs: Reverb[];
  status: Status;
  skills: Skills;
};

const EMOKLORE_STATUS_DEFAULTS: Status = {
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
  parameters: {},
  extra: 0,
};

// prettier-ignore
const EMOKLORE_SKILLS_DEFAULTS: Skills = {
  presets: [
    {
      name: '調査系',
      groups: [
        {
          name: '調査',
          base: '器用',
          skills: [
            { type: "single", name: '検索', exskill: false, bases: ['知力'], level: 0 },
            { type: "single", name: '洞察', exskill: false, bases: ['知力'], level: 0 },
            { type: "single", name: 'マッピング', exskill: false, bases: ['器用', '五感'], level: 0 },
            { type: "single", name: '直感', exskill: false, bases: ['精神', '運勢'], level: 0 },
            { type: "single", name: '鑑定', exskill: false, bases: ['五感', '知力'], level: 0 },
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
            { type: "single", name: '観察眼', exskill: false, bases: ['五感'], level: 0 },
            { type: "single", name: '聞き耳', exskill: false, bases: ['五感'], level: 0 },
            { type: "single", name: '毒味', exskill: false, bases: ['五感'], level: 0 },
            { type: "single", name: '危機察知', exskill: false, bases: ['五感', '運勢'], level: 0 },
            { type: "single", name: '霊感', exskill: true, bases: ['精神', '運勢'], level: 0 },
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
            { type: "single", name: '社交術', exskill: false, bases: ['社会'], level: 0 },
            { type: "single", name: 'ディベート', exskill: false, bases: ['知力'], level: 0 },
            { type: "single", name: '魅了', exskill: false, bases: ['魅力'], level: 0 },
            { type: "single", name: '心理', exskill: false, bases: ['精神', '知力'], level: 0 },
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
          skills: [{ type: "single", name: '耐久', exskill: false, bases: ['身体'], level: 0 }],
        },
        {
          name: '自我',
          base: '精神',
          skills: [{ type: "single", name: '根性', exskill: false, bases: ['精神'], level: 0 }],
        },
        {
          name: '手当て',
          base: '知力',
          skills: [
            { type: "single", name: '医術', exskill: false, bases: ['器用', '知力'], level: 0 },
            { type: "single", name: '蘇生', exskill: true, bases: ['知力', '精神'], level: 0 },
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
          skills: [{ type: "multi", name: '専門知識', exskill: false, bases: ['知力'], genres: [] }],
        },
        {
          name: 'ニュース',
          base: '社会',
          skills: [
            { type: "single", name: '事情通', exskill: false, bases: ['五感', '社会'], level: 0 },
            { type: "multi", name: '業界', exskill: false, bases: ['社会', '魅力'], genres: [] },
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
            { type: "single", name: 'スピード', exskill: false, bases: ['身体'], level: 0 },
            { type: "single", name: 'ストレングス', exskill: false, bases: ['身体'], level: 0 },
            { type: "single", name: 'アクロバット', exskill: false, bases: ['身体', '器用'], level: 0 },
            { type: "single", name: 'ダイブ', exskill: false, bases: ['身体'], level: 0 },
          ],
        },
        {
          name: '格闘',
          base: '身体',
          skills: [
            { type: "multi", name: '武術', exskill: false, bases: ['身体'], genres: [] },
            { type: "multi", name: '奥義', exskill: true, bases: ['身体', '精神', '器用'], genres: [] },
          ],
        },
        {
          name: '投擲',
          base: '器用',
          skills: [
            { type: "multi", name: '射撃', exskill: true, bases: ['器用', '五感'], genres: [] },
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
            { type: "multi", name: '技工', exskill: false, bases: ['器用'], genres: [] },
            { type: "multi", name: '芸術', exskill: false, bases: ['器用', '精神', '五感'], genres: [] },
            { type: "multi", name: '操縦', exskill: false, bases: ['器用', '五感', '知力'], genres: [] },
            { type: "single", name: '暗号', exskill: false, bases: ['知力'], level: 0 },
            { type: "single", name: '電脳', exskill: false, bases: ['知力'], level: 0 },
            { type: "single", name: '隠匿', exskill: false, bases: ['器用', '社会', '運勢'], level: 0 },
          ],
        },
        {
          name: '幸運',
          base: '運勢',
          skills: [{ type: "single", name: '強運', exskill: true, bases: ['運勢'], level: 0 }],
        },
      ],
    },
  ],
  custom: [],
  extra: 0,
}

export const EMOKLORE_DATA_DEFAULTS: EmokloreData = {
  emotions: {},
  reverbs: [],
  resonance: 0,
  status: EMOKLORE_STATUS_DEFAULTS,
  skills: EMOKLORE_SKILLS_DEFAULTS,
};
