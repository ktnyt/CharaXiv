import { Button } from "@charaxiv/components/Button";
import { IconButton } from "@charaxiv/components/IconButton";
import { Input } from "@charaxiv/components/Input";
import { Markdown } from "@charaxiv/components/Markdown";
import { Section } from "@charaxiv/components/Section";
import { TagInput } from "@charaxiv/components/TagInput";
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
      <Section class="flex flex-col w-full">
        <div class="flex flex-col w-full">
          <div class="flex justify-center items-center w-full aspect-square">
            <div class="flex justify-center items-center w-full h-full transition animate-pulse bg-nord-200 text-nord-300 dark:bg-nord-800 dark:text-nord-700">
              <span class="inline-block text-8xl">
                <i class="fas fa-image" />
              </span>
            </div>
          </div>

          <div class="grid grid-cols-[32px_32px_1fr_32px] m-2 gap-2">
            <IconButton>
              <i class="fas fa-chevron-left" />
            </IconButton>

            <IconButton variant="outline" color="red">
              <i class="fas fa-trash-alt" />
            </IconButton>

            <Button variant="outline" color="blue">
              画像を追加
            </Button>

            <IconButton>
              <i class="fas fa-chevron-right" />
            </IconButton>
          </div>
        </div>

        <div class="flex flex-col space-y-4 m-2">
          <div class="flex flex-col space-y-1">
            <Input placeholder="名前" borderless class="h-[44px] text-3xl" />
            <Input placeholder="よみがな" borderless class="text-base" />
          </div>
          <TagInput values={values()} update={(values) => valuesSet(values)} />
          <Markdown text="# Public Memo" />
          <Markdown text="# Secret Memo" />
        </div>
      </Section>
    </div>
  );
};
