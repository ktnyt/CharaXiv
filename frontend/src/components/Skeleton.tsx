import clsx from "clsx";
import { Component, ComponentProps } from "solid-js";
import { Icon, SolidImage } from "./Icon";

export const ImageSkeleton: Component = () => (
  <div class="flex h-full w-full animate-pulse items-center justify-center bg-nord-200 text-nord-300 transition dark:bg-nord-800 dark:text-nord-700">
    <span class="inline-block text-8xl">
      <Icon of={SolidImage} />
    </span>
  </div>
);

export const TextSkeleton: Component<ComponentProps<"span">> = (props) => (
  <span {...props} class={clsx(props.class, "inline-flex items-center")}>
    <span class="inline-block h-1/3 w-full animate-pulse select-none rounded-full bg-nord-200 transition dark:bg-nord-800" />
  </span>
);

export const Skeleton = { Image: ImageSkeleton, Text: TextSkeleton };
