import {
  Component,
  ComponentProps,
  createEffect,
  JSX,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";
import { subscribe, unsubscribe } from "../context/resizeObserver";
import { createRef } from "../hooks/createRef";

export type RulerProps<T extends HTMLElement, U extends JSX.Element> = {
  update: (entry: ResizeObserverEntry, observer: ResizeObserver) => void;
  children: (ref: (el: T) => void) => U;
};

export const Ruler = <T extends HTMLElement, U extends JSX.Element>(
  props: RulerProps<T, U>,
) => {
  const [ref, setRef] = createRef<T>();
  const callback = (entry: ResizeObserverEntry, observer: ResizeObserver) =>
    props.update(entry, observer);
  onMount(() => subscribe(ref(), callback));
  onCleanup(() => unsubscribe(ref(), callback));
  return props.children(setRef);
};

export type Ruler2Props = ComponentProps<"div"> & {
  update: (entry: ResizeObserverEntry, observer: ResizeObserver) => void;
};

export const Ruler2: Component<Ruler2Props> = (props) => {
  const [given, rest] = splitProps(props, ["ref", "update"]);
  const [localRef, setLocalRef] = createRef<HTMLDivElement>();

  createEffect(() => {
    const givenRef = given.ref;
    if (typeof givenRef === "function") {
      givenRef(localRef());
    }
  });

  const refSetter = () => {
    const givenRef = given.ref;
    if (givenRef && typeof givenRef !== "function") {
      return givenRef;
    }
    return setLocalRef;
  };

  const ref = () => {
    const givenRef = given.ref;
    if (givenRef && typeof givenRef !== "function") {
      return givenRef;
    }
    return localRef();
  };

  const callback = (entry: ResizeObserverEntry, observer: ResizeObserver) =>
    given.update(entry, observer);
  onMount(() => subscribe(ref(), callback));
  onCleanup(() => unsubscribe(ref(), callback));

  return <div {...rest} ref={refSetter()} />;
};
