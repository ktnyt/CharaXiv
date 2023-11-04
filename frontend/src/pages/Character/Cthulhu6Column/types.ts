export const VARIABLE_KEYS = [
  "STR",
  "CON",
  "POW",
  "DEX",
  "APP",
  "SIZ",
  "INT",
  "EDU",
] as const;

export type VariableKey = (typeof VARIABLE_KEYS)[number];

export const VARIABLE_EMOJI: Record<VariableKey, string> = {
  STR: "💪",
  CON: "💎",
  POW: "💭",
  DEX: "🤸",
  APP: "💖",
  SIZ: "📐",
  INT: "💡",
  EDU: "📚",
};

export type Variables = Record<VariableKey, number>;

export type Range = { min: number; max: number };

export type Dice = Range[];

export const D6: Range = { min: 1, max: 6 };

export const VARIABLE_MIN: Record<VariableKey, number> = {
  STR: 3,
  CON: 3,
  POW: 3,
  DEX: 3,
  APP: 3,
  SIZ: 8,
  INT: 8,
  EDU: 6,
};

export const VARIABLE_MAX: Record<VariableKey, number> = {
  STR: 18,
  CON: 18,
  POW: 18,
  DEX: 18,
  APP: 18,
  SIZ: 18,
  INT: 18,
  EDU: 21,
};

export const VARIABLE_DICE: Record<VariableKey, Dice> = {
  STR: [D6, D6, D6],
  CON: [D6, D6, D6],
  POW: [D6, D6, D6],
  DEX: [D6, D6, D6],
  APP: [D6, D6, D6],
  SIZ: [D6, D6, { min: 6, max: 6 }],
  INT: [D6, D6, { min: 6, max: 6 }],
  EDU: [D6, D6, D6, { min: 3, max: 3 }],
};

export const PARAMETER_KEYS = [
  "初期SAN",
  "不定SAN",
  "幸運",
  "アイデア",
  "知識",
  "職業P",
  "趣味P",
] as const;

export type ParameterKey = (typeof PARAMETER_KEYS)[number];

export type Parameters = Partial<Record<ParameterKey, number>>;

export const PARAMETER_EDITABLE: Record<ParameterKey, boolean> = {
  初期SAN: false,
  不定SAN: false,
  幸運: false,
  アイデア: false,
  知識: false,
  職業P: false,
  趣味P: false,
};

export type ParameterFormula = (variables: Variables) => number;

export const PARAMETER_FORMULA: Record<ParameterKey, ParameterFormula> = {
  初期SAN: (variables) => variables["POW"] * 5,
  不定SAN: (variables) => variables["POW"] * 4,
  幸運: (variables) => variables["POW"] * 5,
  アイデア: (variables) => variables["INT"] * 5,
  知識: (variables) => variables["EDU"] * 5,
  // 最大HP: (variables) => Math.floor((variables["CON"] + variables["SIZ"]) / 2),
  // 最大MP: (variables) => variables["POW"],
  職業P: (variables) => variables["EDU"] * 20,
  趣味P: (variables) => variables["INT"] * 10,
};

export const MUTABLE_KEYS = ["HP", "MP", "SAN"] as const;

export type MutableKey = (typeof MUTABLE_KEYS)[number];

export type Status = {
  variables: Variables;
  parameters: Parameters;
};

const CTHULHU_STATUS_DEFAULTS: Status = {
  variables: {
    STR: 11,
    CON: 11,
    POW: 11,
    DEX: 11,
    APP: 11,
    SIZ: 13,
    INT: 13,
    EDU: 14,
  },
  parameters: {},
};

export type CthulhuData = {
  status: Status;
};

export const CTHULHU_DATA_DEFAULTS: CthulhuData = {
  status: CTHULHU_STATUS_DEFAULTS,
};
