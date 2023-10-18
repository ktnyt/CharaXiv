import { JSX, onCleanup, onMount } from "solid-js";

export type PointerEvent = MouseEvent | TouchEvent;

export type EventCoords = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
};

export const getEventCoords = (event: PointerEvent): EventCoords => {
  if (!("touches" in event)) {
    const { clientX, clientY, pageX, pageY, screenX, screenY } = event;
    return { clientX, clientY, pageX, pageY, screenX, screenY };
  }
  if (event.changedTouches.length > 0) {
    const { clientX, clientY, pageX, pageY, screenX, screenY } =
      event.changedTouches[0];
    return { clientX, clientY, pageX, pageY, screenX, screenY };
  }
  const { clientX, clientY, pageX, pageY, screenX, screenY } = event.touches[0];
  return { clientX, clientY, pageX, pageY, screenX, screenY };
};

export type DragChildProps<T extends HTMLElement> = {
  onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
  onTouchStart: JSX.EventHandlerUnion<T, TouchEvent>;
};

export type DragProps<T extends HTMLElement, U extends JSX.Element> = {
  disabled?: boolean;
  atStart?: (coords: EventCoords) => void;
  atMove?: (coords: EventCoords) => void;
  atEnd?: (coords: EventCoords) => void;
  children: (props: DragChildProps<T>) => U;
};

export const Drag = <T extends HTMLElement, U extends JSX.Element>(
  props: DragProps<T, U>,
): JSX.Element => {
  const disabled = () => props.disabled ?? false;
  let dragging = false;

  const mouseDownHandle: JSX.EventHandler<T, MouseEvent> = (event) => {
    if (!disabled()) {
      if (props.atStart) props.atStart(getEventCoords(event));
      dragging = true;
    }
  };

  const touchStartHandle: JSX.EventHandler<T, TouchEvent> = (event) => {
    if (!disabled()) {
      if (event.touches.length === 1) {
        if (props.atStart) props.atStart(getEventCoords(event));
        dragging = true;
      }
    }
  };

  const mouseMoveHandle = (event: MouseEvent) => {
    if (!disabled() && dragging) {
      event.preventDefault();
      if (props.atMove) props.atMove(getEventCoords(event));
    }
  };

  const touchMoveHandle = (event: TouchEvent) => {
    if (!disabled() && dragging && event.touches.length === 1) {
      if (props.atMove) props.atMove(getEventCoords(event));
    }
  };

  const releaseHandle = (event: PointerEvent) => {
    if (!disabled() && dragging) {
      if (props.atEnd) props.atEnd(getEventCoords(event));
      dragging = false;
    }
  };

  onMount(() => {
    document.addEventListener("mousemove", mouseMoveHandle);
    document.addEventListener("mouseup", releaseHandle);
    document.addEventListener("touchmove", touchMoveHandle);
    document.addEventListener("touchend", releaseHandle);
    document.addEventListener("touchcancel", releaseHandle);
  });

  onCleanup(() => {
    document.removeEventListener("mousemove", mouseMoveHandle);
    document.removeEventListener("mouseup", releaseHandle);
    document.removeEventListener("touchmove", touchMoveHandle);
    document.removeEventListener("touchend", releaseHandle);
    document.removeEventListener("touchcancel", releaseHandle);
  });

  return props.children({
    onMouseDown: mouseDownHandle,
    onTouchStart: touchStartHandle,
  });
};
