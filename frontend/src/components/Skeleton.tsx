import clsx from "clsx";
import { Component, ComponentProps } from "solid-js";

export const ImageSkeleton: Component = () => (
  <div class="flex justify-center items-center w-full h-full transition animate-pulse bg-nord-200 text-nord-300 dark:bg-nord-800 dark:text-nord-700">
    <span class="inline-block text-8xl">
      <i class="fas fa-image" />
    </span>
  </div>
);

export const TextSkeleton: Component<ComponentProps<"span">> = (props) => (
  <span {...props} class={clsx(props.class, "inline-flex items-center")}>
    <span class="inline-block rounded-full w-full h-1/3 select-none transition animate-pulse bg-nord-200 dark:bg-nord-800" />
  </span>
);

export const Skeleton = { Image: ImageSkeleton, Text: TextSkeleton };
