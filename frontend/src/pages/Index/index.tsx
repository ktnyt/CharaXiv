import { Stack } from "@charaxiv/components/Stack";
import { authenticated } from "@charaxiv/context/authenticated";
import { Component, Match, Switch } from "solid-js";
import { Sheets } from "./Sheets";
import { Login } from "./Login";

export const IndexPage: Component = () => (
  <Stack>
    <Switch>
      <Match when={!authenticated.loading && !authenticated()}>
        <Login />
      </Match>
      <Match when={!authenticated.loading && authenticated()}>
        <Sheets />
      </Match>
    </Switch>
  </Stack>
);

export default IndexPage;
