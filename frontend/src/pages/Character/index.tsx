import { Article } from "@charaxiv/components/Article";
import { Header } from "@charaxiv/components/Header";
import {
  BrandMarkdown,
  Icon,
  RegularCopy,
  SolidArrowUpFromBracket,
  SolidClipboard,
  SolidCopy,
  SolidDove,
  SolidLink,
  SolidPalette,
} from "@charaxiv/components/Icon";
import { IconButton } from "@charaxiv/components/IconButton";
import { Select } from "@charaxiv/components/Select";
import { MarkdownMode, MarkdownModeToggle } from "@charaxiv/context/markdown";
import { useParams } from "@solidjs/router";
import { Component, Match, Switch, lazy } from "solid-js";
const Cthulhu6 = lazy(() => import("./Cthulhu6"));
const Emoklore = lazy(() => import("./Emoklore"));

export const SheetPage: Component = () => {
  const params = useParams<{ character_id: string }>();

  // const [sheet, refetchSheet] = createResource(() =>
  //   callSheetGet(params.sheet_id),
  // );

  const systems = [
    { value: "emoklore", label: "エモクロアTRPG" },
    { value: "cthulhu6", label: "CoC第6版" },
  ];

  const sheet = { system: "emoklore" };

  return (
    <Article>
      <Header>
        <IconButton
          variant="outline"
          color={MarkdownMode() ? "green" : "default"}
          onClick={MarkdownModeToggle}
        >
          <Icon of={BrandMarkdown} />
        </IconButton>

        <IconButton variant="default" color="blue">
          <Icon of={SolidArrowUpFromBracket} />
        </IconButton>

        <Select
          value={sheet.system}
          options={systems}
          atSelect={(value) => {}}
        />
      </Header>

      <Switch>
        <Match when={sheet.system === "emoklore"}>
          <Emoklore />
        </Match>
        <Match when={sheet.system === "cthulhu6"}>
          <Cthulhu6 />
        </Match>
      </Switch>
    </Article>
  );
};

export default SheetPage;
