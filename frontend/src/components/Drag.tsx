import { Component, createSignal, JSX, onCleanup, onMount } from "solid-js";
import { delegateEvent, delegateJSXEvent } from "./utils";

export type DragChildProps<T extends HTMLElement> = {
  onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
  onTouchStart: JSX.EventHandlerUnion<T, TouchEvent>;
};

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
  if ("touches" in event) {
    const { clientX, clientY, pageX, pageY, screenX, screenY } =
      event.touches[0];
    return { clientX, clientY, pageX, pageY, screenX, screenY };
  } else {
    const { clientX, clientY, pageX, pageY, screenX, screenY } = event;
    return { clientX, clientY, pageX, pageY, screenX, screenY };
  }
};

export type DragProps<T extends HTMLElement, U extends JSX.Element> = {
  disabled?: boolean;
  onDragStart?: JSX.EventHandlerUnion<T, PointerEvent>;
  onDragMove?: (event: PointerEvent) => void;
  onDragEnd?: (event: PointerEvent) => void;
  children: (props: DragChildProps<T>) => U;
};

export const Drag = <T extends HTMLElement, U extends JSX.Element>(
  props: DragProps<T, U>,
) => {
  const disabled = () => props.disabled ?? false;
  const [dragging, draggingSet] = createSignal(false);

  const onDragStart = delegateJSXEvent(() => props.onDragStart);
  const onDragMove = delegateEvent(() => props.onDragMove);
  const onDragEnd = delegateEvent(() => props.onDragEnd);

  const onMouseDown: JSX.EventHandler<T, MouseEvent> = (event) => {
    if (!disabled()) {
      draggingSet(true);
      onDragStart(event);
    }
  };

  const onTouchStart: JSX.EventHandler<T, TouchEvent> = (event) => {
    if (!disabled()) {
      if (event.touches.length === 1) {
        draggingSet(true);
        onDragStart(event);
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!disabled() && dragging()) {
      onDragMove(event);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!disabled() && dragging() && event.touches.length === 1) {
      onDragMove(event);
    }
  };

  const handleRelease = (event: PointerEvent) => {
    if (!disabled() && dragging()) {
      draggingSet(false);
      onDragEnd(event);
    }
  };

  onMount(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleRelease);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleRelease);
    document.addEventListener("touchcancel", handleRelease);
  });

  onCleanup(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleRelease);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleRelease);
    document.removeEventListener("touchcancel", handleRelease);
  });

  return props.children({ onMouseDown, onTouchStart });
};
