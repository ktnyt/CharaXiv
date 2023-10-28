import { createLocalStorage } from "@charaxiv/hooks/createLocalStorage";
import { GameSystem } from "@charaxiv/types/GameSystem";
import { createRoot } from "solid-js";

export type UserSettings = {
  editMode: "wysiwyg" | "markdown";
  gameSystem: GameSystem;
};

export const UserSettingsCtx = createRoot(() => {
  const [get, set] = createLocalStorage<UserSettings>("userSetting", {
    editMode: "wysiwyg",
    gameSystem: "emoklore",
  });

  const toggleEditMode = () =>
    set(({ editMode, ...setting }) => ({
      ...setting,
      editMode: editMode === "wysiwyg" ? "markdown" : "wysiwyg",
    }));

  const changeGameSystem = (gameSystem: GameSystem) =>
    set((setting) => ({ ...setting, gameSystem }));

  return {
    get editMode() {
      return get().editMode;
    },
    get gameSystem() {
      return get().gameSystem;
    },
    toggleEditMode,
    changeGameSystem,
  };
});
