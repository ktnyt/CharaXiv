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

export type Variables = Record<VariableKey, number>;

export const PARAMETER_KEYS = ["SAN", "HP", "MP"] as const;

export type ParameterKey = (typeof PARAMETER_KEYS)[number];

export type Parameters = Record<ParameterKey, number>;

export type Status = {
  variables: Variables;
  parameters: Parameters;
};

export type CthulhuData = {};
