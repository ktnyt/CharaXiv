import { Article } from "@charaxiv/components/Article";
import { Header } from "@charaxiv/components/Header";
import {
  BrandMarkdown,
  Icon,
  SolidArrowUpFromBracket,
} from "@charaxiv/components/Icon";
import { IconButton } from "@charaxiv/components/IconButton";
import { Select } from "@charaxiv/components/Select";
import { UserSettingsCtx } from "@charaxiv/context/UserSettings";
import { GameSystems } from "@charaxiv/types/GameSystem";
import { useParams } from "@solidjs/router";
import { Component, Match, Switch, createEffect, lazy } from "solid-js";
import { EMOKLORE_DATA_DEFAULTS, EmokloreData } from "./EmokloreColumn/types";
import { Character } from "@charaxiv/types/character";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { EmokloreReducer } from "./EmokloreColumn/reducer";
import { createDebounce } from "@charaxiv/hooks/createDebounce";
import { ProfileColumn } from "./ProfileColumn";
const Cthulhu6 = lazy(() => import("./Cthulhu6Column"));
const EmokloreColumn = lazy(() => import("./EmokloreColumn"));

export const SheetPage: Component = () => {
  const params = useParams<{ character_id: string }>();

  const sheet: Character = {
    id: "hoge",
    owner: "nano",
    profile: {
      name: "",
      ruby: "",
      tags: [],
      images: [],
      public: "",
      secret: "",
    },
    systems: { emoklore: EMOKLORE_DATA_DEFAULTS },
  };

  return (
    <Article>
      <Header>
        <IconButton
          variant="outline"
          color={UserSettingsCtx.editMode === "markdown" ? "green" : "default"}
          onClick={UserSettingsCtx.toggleEditMode}
        >
          <Icon of={BrandMarkdown} />
        </IconButton>

        <IconButton variant="default" color="blue">
          <Icon of={SolidArrowUpFromBracket} />
        </IconButton>

        <Select
          index={GameSystems.findIndex(
            ({ value }) => value === UserSettingsCtx.gameSystem,
          )}
          options={GameSystems}
          renderSelect={({ short }) => short}
          renderOption={({ label }) => label}
          atSelect={(index) =>
            UserSettingsCtx.changeGameSystem(GameSystems[index].value)
          }
        />
      </Header>
      <div class="mt-4 grid grid-cols-[minmax(320px,_480px)] sm:grid-cols-[minmax(320px,_480px)_minmax(320px,_400px)] sm:gap-x-4">
        <ProfileColumn
          init={sheet.profile}
          atUpdate={(profile) => console.log(profile)}
        />

        <Switch>
          <Match when={UserSettingsCtx.gameSystem === "emoklore"}>
            <EmokloreColumn
              init={sheet.systems.emoklore ?? EMOKLORE_DATA_DEFAULTS}
              atUpdate={(data) => console.log(data)}
            />
          </Match>

          <Match when={UserSettingsCtx.gameSystem === "cthulhu6"}>
            <Cthulhu6 />
          </Match>
        </Switch>
      </div>
    </Article>
  );
};

export default SheetPage;
