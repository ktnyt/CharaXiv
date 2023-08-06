import { Accessor, createEffect, onMount } from "solid-js";
import { createLocalStorage } from "./createLocalStorage";

export type Fetcher<T> = () => Promise<T>;
export type Fetched<T> = Accessor<T | undefined>;

export const createSWR = <T>(key: string, fetcher: Fetcher<T>): Fetched<T> => {
  const [value, setValue] = createLocalStorage<T | undefined>(key, undefined);
  onMount(async () => {
    const response = await fetcher();
    setValue(() => response);
  });
  return value;
};
