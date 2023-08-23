import {
  Index,
  ParentProps,
  children,
  createEffect,
  createSignal,
} from "solid-js";
import { Drag, EventCoords, getEventCoords } from "./Drag";
import { Tap } from "./Tap";
import clsx from "clsx";

export type SlideSelectorProps<T> = ParentProps<{
  value?: number;
  commit?: (value: number) => void;
}>;

export const SlideSelector = <T extends unknown>(
  props: SlideSelectorProps<T>,
) => {
  const resolved = children(() => props.children);
  const childElements = resolved.toArray();

  let value = props.value ?? 0;
  let origin: EventCoords | undefined;
  let handler: number | undefined;

  const [getDelta, setDelta] = createSignal((props.value ?? 0) * 32);
  const [getActive, setActive] = createSignal(false);
  createEffect(() => {
    value = props.value ?? 0;
    setDelta(value * 32);
  });

  const computeOpacity = (index: number) => {
    const distance = Math.abs(index * 32 - getDelta());
    return Math.floor(
      distance < 16 ? 100 : 75 * (1 / (Math.sqrt(distance) / 10 + 1)),
    );
  };

  return (
    <Drag
      onDragStart={(event) => {
        event.preventDefault();
        handler = setTimeout(() => {
          origin = getEventCoords(event);
          handler = undefined;
          setActive(true);
        }, 200);
      }}
      onDragMove={(event) => {
        if (origin) {
          event.preventDefault();
          let delta = origin.pageX - getEventCoords(event).pageX + value * 32;
          if (delta < 0) {
            delta = -Math.sqrt(Math.abs(delta));
          }
          const max = childElements.length * 32;
          if (delta > max) {
            delta = max + Math.sqrt(delta - max);
          }
          setDelta(delta);
        }
      }}
      onDragEnd={(event) => {
        event.preventDefault();
        if (handler) {
          clearTimeout(handler);
          handler = undefined;
        }
        if (origin) {
          value += Math.floor(
            (origin.pageX - getEventCoords(event).pageX + 16) / 32,
          );
          value = Math.min(Math.max(0, value), childElements.length - 1);
          if (props.commit) {
            props.commit(value);
          }
          origin = undefined;
          setDelta(value * 32);
          setActive(false);
        }
      }}
    >
      {(dragProps) => (
        <div
          class="flex justify-center w-full h-8 overflow-clip select-none"
          {...dragProps}
        >
          <div class="flex w-8 h-8">
            <div class="flex flex-row">
              <Index each={childElements}>
                {(getChild, index) => (
                  <Tap
                    onTap={(e) => {
                      value = index;
                      if (props.commit) {
                        props.commit(value);
                      }
                      setDelta(index * 32);
                    }}
                  >
                    {(tapProps) => (
                      <div
                        class="flex justify-center align-middle w-8 h-8 leading-8"
                        style={{
                          transform: `translateX(${-getDelta()}px)`,
                          transition: getActive()
                            ? undefined
                            : "transform 0.3s",
                          opacity: `${computeOpacity(index)}%`,
                        }}
                        {...tapProps}
                      >
                        {getChild()}
                      </div>
                    )}
                  </Tap>
                )}
              </Index>
            </div>
          </div>
        </div>
      )}
    </Drag>
  );
};
