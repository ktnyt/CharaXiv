import { callSheetGet } from '@charaxiv/api/sheet'
import { Article } from '@charaxiv/components/Article'
import { Button } from '@charaxiv/components/Button'
import { Header } from '@charaxiv/components/Header'
import { IconButton } from '@charaxiv/components/IconButton'
import { Input } from '@charaxiv/components/Input'
import { Markdown } from '@charaxiv/components/Markdown'
import { Section } from '@charaxiv/components/Section'
import { TagInput } from '@charaxiv/components/TagInput'
import { useParams } from '@solidjs/router'
import { Component, createResource } from 'solid-js'

export const SheetPage: Component = () => {
  const params = useParams<{ sheet_id: string }>()

  const [sheet, refetchSheet] = createResource(() =>
    callSheetGet(params.sheet_id),
  )

  return (
    <Article>
      <Header>
        <IconButton variant="outline" color="default">
          <i class="fas fa-link" />
        </IconButton>

        <IconButton variant="outline" color="blue">
          <i class="fas fa-palette" />
        </IconButton>

        <IconButton variant="default" color="blue">
          <i class="fas fa-dove" />
        </IconButton>
      </Header>

      <div class="grid grid-cols-[minmax(320px,_480px)] sm:grid-cols-[minmax(320px,_480px)_minmax(320px,_400px)] sm:gap-x-4 mt-4">
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

            <div class="flex flex-col space-y-1 m-2">
              <Input placeholder="名前" borderless class="h-[44px] text-3xl" />
              <Input placeholder="よみがな" borderless class="text-base" />
              <TagInput />
              <Markdown text="" />
            </div>
          </Section>
        </div>

        <div>
          <Section class="flex flex-col w-full"></Section>
        </div>
      </div>
    </Article>
  )
}

export default SheetPage
