import { Article } from "@charaxiv/components/Article";
import { Header } from "@charaxiv/components/Header";
import {
  BrandMarkdown,
  Icon,
  SolidArrowUpFromBracket,
  SolidCheck,
} from "@charaxiv/components/Icon";
import { IconButton } from "@charaxiv/components/IconButton";
import { Select } from "@charaxiv/components/Select";
import { UserSettingsCtx } from "@charaxiv/context/UserSettings";
import { GameSystem, GameSystems } from "@charaxiv/types/GameSystem";
import { useParams } from "@solidjs/router";
import { Component, Match, Switch, lazy } from "solid-js";
import { EMOKLORE_DATA_DEFAULTS } from "./EmokloreColumn/types";
import { Character, Profile } from "@charaxiv/types/character";
import { ProfileColumn } from "./ProfileColumn";
import { twMerge } from "tailwind-merge";
import { Overlay } from "@charaxiv/components/Overlay";
import { Layout } from "./Layout";
const Cthulhu6 = lazy(() => import("./Cthulhu6Column"));
const EmokloreColumn = lazy(() => import("./EmokloreColumn"));

const syncProfile = (id: string, profile: Profile) => {};
const syncSystem = <T extends unknown>(
  id: string,
  key: GameSystem,
  data: T,
) => {};

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
    systems: {},
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

      <div
        class={twMerge(
          "grid sm:my-4 sm:gap-x-4",
          "grid-cols-[minmax(320px,_480px)]",
          "sm:grid-cols-[minmax(320px,_480px)_minmax(320px,_400px)]",
          "xl:grid-cols-[480px_minmax(672px,_832px)]",
          "2xl:grid-cols-[480px_minmax(1024px,_1264px)]",
        )}
      >
        <ProfileColumn
          init={sheet.profile}
          atUpdate={(profile) => console.log(profile)}
        />

        <Layout>
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
        </Layout>
      </div>

      <Overlay class="pointer-events-none">
        <div class="fixed bottom-0 right-0 m-1 flex h-4 w-4 items-center justify-center">
          <Icon of={SolidCheck} class="fa-xs text-green-500" />
        </div>
      </Overlay>
    </Article>
  );
};

export default SheetPage;
