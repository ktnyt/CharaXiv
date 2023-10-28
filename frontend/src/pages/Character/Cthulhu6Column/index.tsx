import { Component, createSignal } from "solid-js";
import { ColumnRight } from "./ColumnRight";
import { ProfileColumn } from "../ProfileColumn";

export type Cthulhu6Props = {
  // sheet: Sheet<Cthulhu6Data>;
};

export const Cthulhu6: Component<Cthulhu6Props> = () => {
  const [loading, loadingSet] = createSignal(true);

  const toggleLoading = () => loadingSet((prev) => !prev);
  return <ColumnRight />;
};

export default Cthulhu6;
