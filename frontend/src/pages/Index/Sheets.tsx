import { callSheetCreate, callSheetList } from '@charaxiv/api/sheet'
import { Article } from '@charaxiv/components/Article'
import { Button } from '@charaxiv/components/Button'
import { Header } from '@charaxiv/components/Header'
import { IconButton } from '@charaxiv/components/IconButton'
import { createLocalStorage } from '@charaxiv/hooks/createLocalStorage'
import { useNavigate } from '@solidjs/router'
import { Component, createResource, Index, Show } from 'solid-js'

export const Sheets: Component = () => {
  const navigate = useNavigate()

  const [display, setDisplay] = createLocalStorage<'list' | 'grid'>(
    'SHEET_LIST_DISPLAY',
    'list',
  )

  const [sheetList] = createResource(
    async () => await callSheetList('emoklore'),
  )

  const onClickSheetCreate = async () => {
    const sheetId = await callSheetCreate('emoklore')
    navigate(`/sheet/${sheetId}`)
  }

  return (
    <Article>
      <Header>
        <div class="flex flex-row">
          <IconButton
            class="rounded-r-none disabled:bg-nord-300 disabled:text-nord-1000 disabled:opacity-100"
            disabled={display() === 'list'}
            onClick={() => setDisplay('list')}
          >
            <i class="fas fa-list" />
          </IconButton>
          <IconButton
            class="rounded-l-none disabled:bg-nord-300 disabled:text-nord-1000 disabled:opacity-100"
            disabled={display() === 'grid'}
            onClick={() => setDisplay('grid')}
          >
            <i class="fas fa-border-all" />
          </IconButton>
        </div>

        <IconButton
          variant="default"
          color="blue"
          onClick={() => onClickSheetCreate()}
        >
          <i class="fas fa-user-plus" />
        </IconButton>
      </Header>

      <Show
        when={sheetList.loading || sheetList()!.length > 0}
        fallback={
          <div class="flex justify-center items-center w-full h-full">
            <Button
              color="blue"
              variant="default"
              class="shadow"
              onClick={() => onClickSheetCreate()}
            >
              キャラシを作る
            </Button>
          </div>
        }
      >
        <div class="flex justify-center w-full p-4">
          <div class="flex flex-row rounded overflow-clip w-full max-w-[600px] shadow">
            <Index each={sheetList()!}>
              {(sheet) => (
                <div class="relative flex flex-row w-full h-[64px] bg-nord-0">
                  <div class="flex justify-center items-center h-full aspect-square p-2 bg-nord-100">
                    <i class="text-nord-500 text-3xl far fa-image" />
                  </div>
                  <div class="flex flex-col justify-center w-full h-full p-2">
                    <a
                      href={`/sheet/${sheet().id}`}
                      class="after:absolute after:inset-0"
                    >
                      <h2>{sheet().content.name || '名無しさん'}</h2>
                    </a>
                  </div>
                </div>
              )}
            </Index>
          </div>
        </div>
      </Show>
    </Article>
  )
}
