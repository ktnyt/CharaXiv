export const GameSystemKeys = ["emoklore", "cthulhu6"] as const;

export type GameSystem = (typeof GameSystemKeys)[number];

export const GameSystems: {
  value: GameSystem;
  label: string;
  short: string;
}[] = [
  { value: "emoklore", label: "エモクロアTRPG", short: "エモクロアTRPG" },
  {
    value: "cthulhu6",
    label: "第6版 クトゥルフ神話TRPG",
    short: "第6版 CoC",
  },
];
