import { Resource, createEffect, createResource, onMount } from "solid-js";
import { createLocalStorage } from "./createLocalStorage";

export type Fetcher<T> = () => Promise<T>;

export const createSWR = <T>(key: string, fetcher: Fetcher<T>) => {
  const [signal, { refetch }] = createResource(fetcher);
  const [cache, setCache] = createLocalStorage<Resource<T>>(key, signal);
  createEffect(() => setCache(() => signal));
  return [cache, refetch];
};
