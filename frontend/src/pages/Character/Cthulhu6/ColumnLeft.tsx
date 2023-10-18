import { Button } from "@charaxiv/components/Button";
import {
  Icon,
  SolidChevronLeft,
  SolidChevronRight,
  SolidImage,
  SolidTrashAlt,
} from "@charaxiv/components/Icon";
import { IconButton } from "@charaxiv/components/IconButton";
import { Input } from "@charaxiv/components/Input";
import { Markdown } from "@charaxiv/components/Markdown";
import { Section } from "@charaxiv/components/Section";
import { TagEditor } from "@charaxiv/components/TagEditor";
import { createSignal } from "solid-js";

export const ColumnLeft = () => {
  const [values, valuesSet] = createSignal([
    "tag0",
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5",
    "tag6",
    "tag7",
    "tag8",
  ]);
  return (
    <div>
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
            <Input placeholder="名前" borderless class="h-[44px] text-3xl" />
            <Input placeholder="よみがな" borderless class="text-base" />
          </div>
          <TagEditor values={values()} update={(values) => valuesSet(values)} />
          <Markdown text="# Public Memo" />
          <Markdown text="# Secret Memo" />
        </div>
      </Section>
    </div>
  );
};
