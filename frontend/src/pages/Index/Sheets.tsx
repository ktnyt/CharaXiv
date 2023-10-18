import { callSheetCreate, callSheetList } from "@charaxiv/api/sheet";
import { Article } from "@charaxiv/components/Article";
import { Button } from "@charaxiv/components/Button";
import { Header } from "@charaxiv/components/Header";
import {
  Icon,
  RegularImage,
  SolidBorderAll,
  SolidList,
  SolidUserPlus,
} from "@charaxiv/components/Icon";
import { IconButton } from "@charaxiv/components/IconButton";
import { createLocalStorage } from "@charaxiv/hooks/createLocalStorage";
import { useNavigate } from "@solidjs/router";
import { Component, createResource, Index, Show } from "solid-js";

export const Sheets: Component = () => {
  const navigate = useNavigate();

  const [display, setDisplay] = createLocalStorage<"list" | "grid">(
    "SHEET_LIST_DISPLAY",
    "list",
  );

  const [sheetList] = createResource(
    async () => await callSheetList("emoklore"),
  );

  const onClickSheetCreate = async () => {
    const sheetId = await callSheetCreate("emoklore");
    navigate(`/sheet/${sheetId}`);
  };

  return (
    <Article>
      <Header>
        <div class="flex flex-row">
          <IconButton
            class="rounded-r-none disabled:bg-nord-300 disabled:text-nord-1000 disabled:opacity-100"
            disabled={display() === "list"}
            onClick={() => setDisplay("list")}
          >
            <Icon of={SolidList} />
          </IconButton>
          <IconButton
            class="rounded-l-none disabled:bg-nord-300 disabled:text-nord-1000 disabled:opacity-100"
            disabled={display() === "grid"}
            onClick={() => setDisplay("grid")}
          >
            <Icon of={SolidBorderAll} />
          </IconButton>
        </div>

        <IconButton
          variant="default"
          color="blue"
          onClick={() => onClickSheetCreate()}
        >
          <Icon of={SolidUserPlus} />
        </IconButton>
      </Header>

      <Show
        when={sheetList.loading || sheetList()!.length > 0}
        fallback={
          <div class="flex h-full w-full items-center justify-center">
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
        <div class="flex w-full justify-center p-4">
          <div class="flex w-full max-w-[600px] flex-row overflow-clip rounded shadow">
            <Index each={sheetList()!}>
              {(sheet) => (
                <div class="relative flex h-[64px] w-full flex-row bg-nord-0">
                  <div class="flex aspect-square h-full items-center justify-center bg-nord-100 p-2">
                    <span class="text-3xl text-nord-500">
                      <Icon of={RegularImage} />
                    </span>
                  </div>
                  <div class="flex h-full w-full flex-col justify-center p-2">
                    <a
                      href={`/sheet/${sheet().id}`}
                      class="after:absolute after:inset-0"
                    >
                      <h2>{sheet().name || "名無しさん"}</h2>
                    </a>
                  </div>
                </div>
              )}
            </Index>
          </div>
        </div>
      </Show>
    </Article>
  );
};
