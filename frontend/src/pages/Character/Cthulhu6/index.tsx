import { Component, createSignal } from "solid-js";
import { ColumnLeft } from "./ColumnLeft";
import { ColumnRight } from "./ColumnRight";

export type Cthulhu6Props = {
  // sheet: Sheet<Cthulhu6Data>;
};

export const Cthulhu6: Component<Cthulhu6Props> = () => {
  const [loading, loadingSet] = createSignal(true);

  const toggleLoading = () => loadingSet((prev) => !prev);
  return (
    <div class="mt-4 grid grid-cols-[minmax(320px,_480px)] sm:grid-cols-[minmax(320px,_480px)_minmax(320px,_400px)] sm:gap-x-4">
      <ColumnLeft />
      <ColumnRight />
    </div>
  );
};

export default Cthulhu6;
