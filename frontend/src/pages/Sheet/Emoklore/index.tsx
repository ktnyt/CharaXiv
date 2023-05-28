import { Article } from '@charaxiv/components/Article'
import { Button } from '@charaxiv/components/Button'
import { Header } from '@charaxiv/components/Header'
import { IconButton } from '@charaxiv/components/IconButton'
import { Input } from '@charaxiv/components/Input'
import { Section } from '@charaxiv/components/Section'
import { Skeleton } from '@charaxiv/components/Skeleton'
import { TagInput } from '@charaxiv/components/TagInput'
import { Sheet } from '@charaxiv/types/common/sheet'
import { EmokloreData } from '@charaxiv/types/systems/emoklore'
import { Component, createSignal, Show } from 'solid-js'

export type EmokloreProps = {
  sheet: Sheet<EmokloreData>
}

export const Emoklore: Component<EmokloreProps> = () => {
  const [loading, setLoading] = createSignal(true)
  const [values, setValues] = createSignal([
    'tag0',
    'tag1',
    'tag2',
    'tag3',
    'tag4',
    'tag5',
    'tag6',
    'tag7',
    'tag8',
  ])
  const toggleLoading = () => setLoading((prev) => !prev)
  return (
    <Article class="space-y-2">
      <Header>
        <IconButton
          variant="outline"
          color="default"
          onClick={() => toggleLoading()}
        >
          <i class="fas fa-arrows-rotate" />
        </IconButton>

        <IconButton variant="outline" color="default">
          <i class="fas fa-link" />
        </IconButton>

        <IconButton variant="outline" color="blue">
          <i class="fas fa-palette" />
        </IconButton>

        <IconButton variant="default" color="blue">
          <i class="fas fa-code" />
        </IconButton>
      </Header>

      <div class="flex flex-col md:flex-row justify-around w-full md:max-w-3xl">
        <Section class="flex flex-col flex-grow w-full min-w-[320px] md:max-w-[430px] min-h-screen">
          <div class="flex justify-center items-center w-full aspect-square">
            <Skeleton.Image />
          </div>

          <div class="flex flex-col m-2 space-y-2">
            <div class="flex flex-row justify-between w-full space-x-2">
              <IconButton variant="default" color="default">
                <i class="fas fa-chevron-left" />
              </IconButton>

              <IconButton variant="outline" color="red">
                <i class="fas fa-trash-alt" />
              </IconButton>

              <Button variant="outline" color="blue" class="flex-grow">
                画像を追加
              </Button>

              <div class="hidden">
                <IconButton variant="outline" color="default">
                  <i class="fas fa-download" />
                </IconButton>
              </div>

              <div>
                <IconButton variant="default" color="default">
                  <i class="fas fa-chevron-right" />
                </IconButton>
              </div>
            </div>

            <div>
              <Show
                when={!loading()}
                fallback={
                  <div class="w-full">
                    <Skeleton.Text class="w-48 h-12" />
                  </div>
                }
              >
                <Input class="h-12 text-3xl" placeholder="名前" />
              </Show>
            </div>

            <div>
              <TagInput
                values={values()}
                update={(values) => setValues(values)}
              />
            </div>
          </div>
        </Section>

        <Section class="w-full min-w-[320px] md:max-w-[320px] min-h-screen"></Section>
      </div>
    </Article>
  )
}
