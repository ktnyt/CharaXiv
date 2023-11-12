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

export const VARIABLE_LABEL: Record<VariableKey, string> = {
  STR: "S\u{200B}T\u{200B}R",
  CON: "C\u{200B}O\u{200B}N",
  POW: "P\u{200B}O\u{200B}W",
  DEX: "D\u{200B}E\u{200B}X",
  APP: "A\u{200B}P\u{200B}P",
  SIZ: "S\u{200B}I\u{200B}Z",
  INT: "I\u{200B}N\u{200B}T",
  EDU: "E\u{200B}D\u{200B}U",
};

export type VariableValue = {
  base: number;
  adj: number;
  tmp: number;
};

export const computeVariable = (variable: VariableValue) =>
  variable.base + variable.adj + variable.tmp;

export type Variables = Record<VariableKey, VariableValue>;

export type Range = { min: number; max: number };

export type Dice = Range[];

export const D6: Range = { min: 1, max: 6 };

export const VARIABLE_MIN: Record<VariableKey, VariableValue> = {
  STR: { base: 3, adj: 0, tmp: 0 },
  CON: { base: 3, adj: 0, tmp: 0 },
  POW: { base: 3, adj: 0, tmp: 0 },
  DEX: { base: 3, adj: 0, tmp: 0 },
  APP: { base: 3, adj: 0, tmp: 0 },
  SIZ: { base: 8, adj: 0, tmp: 0 },
  INT: { base: 8, adj: 0, tmp: 0 },
  EDU: { base: 6, adj: 0, tmp: 0 },
};

export const VARIABLE_MAX: Record<VariableKey, VariableValue> = {
  STR: { base: 18, adj: 0, tmp: 0 },
  CON: { base: 18, adj: 0, tmp: 0 },
  POW: { base: 18, adj: 0, tmp: 0 },
  DEX: { base: 18, adj: 0, tmp: 0 },
  APP: { base: 18, adj: 0, tmp: 0 },
  SIZ: { base: 18, adj: 0, tmp: 0 },
  INT: { base: 18, adj: 0, tmp: 0 },
  EDU: { base: 21, adj: 0, tmp: 0 },
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
  初期SAN: (variables) => computeVariable(variables["POW"]) * 5,
  不定SAN: (variables) => computeVariable(variables["POW"]) * 4,
  幸運: (variables) => computeVariable(variables["POW"]) * 5,
  アイデア: (variables) => computeVariable(variables["INT"]) * 5,
  知識: (variables) => computeVariable(variables["EDU"]) * 5,
  // 最大HP: (variables) => Math.floor((variableValue(variables["CON"]) + variableValue(variables["SIZ"])) / 2),
  // 最大MP: (variables) => variableValue(variables["POW"]),
  職業P: (variables) => computeVariable(variables["EDU"]) * 20,
  趣味P: (variables) => computeVariable(variables["INT"]) * 10,
};

export const MUTABLE_KEYS = ["HP", "MP", "SAN"] as const;

export type MutableKey = (typeof MUTABLE_KEYS)[number];

export type Status = {
  variables: Variables;
  parameters: Parameters;
};

const CTHULHU_STATUS_DEFAULTS: Status = {
  variables: {
    STR: { base: 11, adj: 0, tmp: 0 },
    CON: { base: 11, adj: 0, tmp: 0 },
    POW: { base: 11, adj: 0, tmp: 0 },
    DEX: { base: 11, adj: 0, tmp: 0 },
    APP: { base: 11, adj: 0, tmp: 0 },
    SIZ: { base: 13, adj: 0, tmp: 0 },
    INT: { base: 13, adj: 0, tmp: 0 },
    EDU: { base: 14, adj: 0, tmp: 0 },
  },
  parameters: {},
};

export type CthulhuData = {
  status: Status;
};

export const CTHULHU_DATA_DEFAULTS: CthulhuData = {
  status: CTHULHU_STATUS_DEFAULTS,
};
