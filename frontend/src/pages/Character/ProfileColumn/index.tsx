import { Button } from "@charaxiv/components/Button";
import { IconButton } from "@charaxiv/components/IconButton";
import { Input } from "@charaxiv/components/Input";
import { Section } from "@charaxiv/components/Section";
import { TagEditor } from "@charaxiv/components/TagEditor";
import { Component } from "solid-js";
import { createReducer } from "@charaxiv/hooks/createReducer";
import { ProfileReducer } from "./reducer";
import {
  Icon,
  SolidChevronLeft,
  SolidChevronRight,
  SolidImage,
  SolidTrashAlt,
} from "@charaxiv/components/Icon";
import { Editor } from "@charaxiv/components/Editor";
import { UserSettingsCtx } from "@charaxiv/context/UserSettings";
import { Profile } from "@charaxiv/types/character";

export type ProfileColumnProps = {
  init: Profile;
  atUpdate: (profile: Profile) => void;
};

export const ProfileColumn: Component<ProfileColumnProps> = (props) => {
  const [state, dispatch] = createReducer(props.init, ProfileReducer, {
    debug: true,
    callback: (profile) => props.atUpdate(profile),
  });

  const nameInputHandle = (value: string) => dispatch({ type: "name", value });
  const rubyInputHandle = (value: string) => dispatch({ type: "ruby", value });
  const publicChangeHandle = (value: string) =>
    dispatch({ type: "public", value });
  const secretChangeHandle = (value: string) =>
    dispatch({ type: "secret", value });

  return (
    <Section class="flex w-full flex-col">
      <div class="flex w-full flex-col">
        <div class="flex aspect-square w-full items-center justify-center">
          <div class="flex h-full w-full animate-pulse items-center justify-center bg-nord-200 text-nord-300 transition dark:bg-nord-800 dark:text-nord-700">
            <span class="inline-block text-8xl">
              <Icon of={SolidImage} />
            </span>
          </div>
        </div>

        <div class="m-2 grid grid-cols-[32px_32px_1fr_32px] gap-2">
          <IconButton>
            <Icon of={SolidChevronLeft} />
          </IconButton>

          <IconButton variant="outline" color="red">
            <Icon of={SolidTrashAlt} />
          </IconButton>

          <Button variant="outline" color="blue">
            画像を追加
          </Button>

          <IconButton>
            <Icon of={SolidChevronRight} />
          </IconButton>
        </div>
      </div>

      <div class="m-2 flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <Input
            placeholder="名前"
            value={state().name}
            borderless
            class="h-[44px] text-3xl placeholder:text-3xl"
            onInput={(event) => nameInputHandle(event.currentTarget.value)}
          />
          <Input
            placeholder="よみがな"
            value={state().ruby}
            borderless
            class="text-base placeholder:text-base"
            onInput={(event) => rubyInputHandle(event.currentTarget.value)}
          />
        </div>

        <TagEditor
          tags={state().tags}
          atUpdate={(value) => dispatch({ type: "tags", value })}
        />

        <div>
          <h2>公開メモ</h2>
          <Editor
            value={state().public}
            wysiwyg={UserSettingsCtx.editMode === "wysiwyg"}
            atChange={publicChangeHandle}
          />
        </div>

        <div>
          <h2>秘匿メモ</h2>
          <Editor
            value={state().secret}
            wysiwyg={UserSettingsCtx.editMode === "wysiwyg"}
            atChange={secretChangeHandle}
          />
        </div>
      </div>
    </Section>
  );
};
