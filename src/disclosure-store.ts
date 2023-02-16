import { writable } from "svelte/store";

export const disclosureStore = (defaultState: boolean) => {
  const isOpen = writable<boolean>(defaultState);
  const { set, update } = isOpen;
  return {
    isOpen,
    open: () => set(true),
    close: () => set(false),
    toggle: () => update((n) => !n),
  };
};
