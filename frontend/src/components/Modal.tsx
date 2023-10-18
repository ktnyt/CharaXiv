import { JSX, onMount } from "solid-js";
import { Tap } from "./Tap";
import { Overlay } from "./Overlay";

export const Modal = (props: {
  atClose: () => void;
  children: JSX.Element;
}) => {
  onMount(() => {
    document.addEventListener("keydown", (event) => {
      if (event.code == "Escape") props.atClose();
    });
  });

  return (
    <Tap onTap={() => props.atClose()}>
      {(outerTapProps) => (
        <Overlay class="bg-nord-500 bg-opacity-40" {...outerTapProps}>
          <div class="flex h-full w-full items-center justify-center">
            <Tap onTap={(event) => event.stopPropagation()}>
              {(innerTapProps) => (
                <div {...innerTapProps}>{props.children}</div>
              )}
            </Tap>
          </div>
        </Overlay>
      )}
    </Tap>
  );
};
