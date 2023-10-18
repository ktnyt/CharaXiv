import { JSX, createMemo, createSignal } from "solid-js";

export interface TapRenderProps<T extends HTMLElement> {
  onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
  onMouseUp: JSX.EventHandlerUnion<T, MouseEvent>;
  onTouchStart: JSX.EventHandlerUnion<T, TouchEvent>;
  onTouchEnd: JSX.EventHandlerUnion<T, TouchEvent>;
  onTouchCancel: JSX.EventHandlerUnion<T, TouchEvent>;
}

export type TapProps<T extends HTMLElement, U extends JSX.Element> = {
  threshold?: number;
  disabled?: boolean;
  onTap?: (event: MouseEvent | TouchEvent) => void;
  children: (props: TapRenderProps<T>) => U;
};

export const Tap = <T extends HTMLElement, U extends JSX.Element>(
  props: TapProps<T, U>,
) => {
  let clicked = false;
  const [origin, setOrigin] = createSignal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const threshold = () => props.threshold ?? 16;

  const onMouseDown: JSX.EventHandlerUnion<T, MouseEvent> = (event) => {
    clicked = true;
    setOrigin({ x: event.pageX, y: event.pageY });
  };

  const onMouseUp: JSX.EventHandlerUnion<T, MouseEvent> = (event) => {
    const { x, y } = origin();
    const dx = event.pageX - x;
    const dy = event.pageY - y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (!props.disabled && clicked && d < threshold() && props.onTap) {
      props.onTap(event);
    }
    clicked = false;
  };

  const onTouchStart: JSX.EventHandlerUnion<T, TouchEvent> = (event) => {
    if (event.touches.length === 1) {
      clicked = true;
      setOrigin({ x: event.touches[0].pageX, y: event.touches[0].pageY });
    }
  };

  const onTouchEnd: JSX.EventHandlerUnion<T, TouchEvent> = (event) => {
    if (event.touches.length === 1) {
      const { x, y } = origin();
      const dx = event.touches[0].pageX - x;
      const dy = event.touches[0].pageY - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (clicked && d < threshold() && props.onTap) {
        props.onTap(event);
      }
      clicked = false;
    }
  };

  const onTouchCancel: JSX.EventHandlerUnion<T, TouchEvent> = () => {
    clicked = false;
  };

  return createMemo(() =>
    props.children({
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
    }),
  );
};
