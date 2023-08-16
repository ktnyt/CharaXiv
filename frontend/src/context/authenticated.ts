import api from "@charaxiv/api";
import { createResource, createRoot } from "solid-js";

export const [authenticated, { refetch: refetchAuthenticated }] = createRoot(
  () => createResource<boolean>(async () => await api.session.get()),
);
