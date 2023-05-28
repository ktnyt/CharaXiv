import { Article } from '@charaxiv/components/Article'
import { Logo } from '@charaxiv/components/Logo'
import { Stack } from '@charaxiv/components/Stack'
import { authenticated } from '@charaxiv/context/authenticated'
import clsx from 'clsx'
import { Component, createSignal, Match, Switch } from 'solid-js'
import { Sheets } from './Sheets'
import { Login } from './Login'

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
)

export default IndexPage
