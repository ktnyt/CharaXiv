import { Article } from "@charaxiv/components/Article";
import { Header } from "@charaxiv/components/Header";
import { IconButton } from "@charaxiv/components/IconButton";
import { useParams } from "@solidjs/router";
import { Component, Match, Switch, createResource, lazy } from "solid-js";
const Cthulhu6 = lazy(() => import("./Cthulhu6"));

export const SheetPage: Component = () => {
  const params = useParams<{ character_id: string }>();

  // const [sheet, refetchSheet] = createResource(() =>
  //   callSheetGet(params.sheet_id),
  // );

  const sheet = { system: "cthulhu6" };

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

      <Switch>
        <Match when={sheet.system === "cthulhu6"}>
          <Cthulhu6 />
        </Match>
      </Switch>
    </Article>
  );
};

export default SheetPage;
