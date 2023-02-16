import { writable } from "svelte/store";

export const toasts = writable<Required<Toast[]>>([]);

type Toast = {
  id?: string;
  title?: string;
  description: string;
  closable?: boolean;
  duration?: number;
};

export const toast = ({
  id: inputId,
  title,
  description,
  closable = true,
  duration = 3000,
}: Toast) => {
  const id = Math.floor(Math.random() * 10000 + 1).toString() ?? inputId;

  toasts.update((all) => [
    { id, title, description, type: "default", closable, duration },
    ...all,
  ]);

  if (duration > 0) setTimeout(() => closeToast(id), duration);
};

export const closeToast = (id: Required<Toast["id"]>) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
