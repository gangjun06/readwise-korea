<script lang="ts">
  import { cva } from "cva";
  import { XIcon } from "lucide-svelte";
  import { cn } from "src/utils/className";
  import { fade } from "svelte/transition";
  import { closeToast } from "./store";

  export let closable = true;

  export let id: string;
  export let title: string;
  export let description: string;

  const toastVariants = cva(
    cn(
      "data-[swipe=move]:transition-none grow-1 group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
      "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4 data-[state=closed]:slide-out-to-right-full",
      "dark:border-slate-700 last:mt-0 sm:last:mt-4",
      "border-l-4 dark:border-l-4 border-l-green-500 dark:border-l-green-600"
    ),
    {
      variants: {
        variant: {
          default:
            "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700",
          destructive:
            "group destructive bg-red-600 text-white border-red-600 dark:border-red-600",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );

  const close = () => {
    closeToast(id);
  };
</script>

<div class={toastVariants({ variant: "default" })} role="alert" transition:fade>
  <div class="grid gap-1">
    {#if title}
      <div class="text-lg font-semibold text-title">
        {title}
      </div>
    {/if}
    {#if description}
      <div class="text-md text-description">{description}</div>
    {/if}
  </div>

  {#if closable}
    <button
      class="absolute top-2 right-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:hover:text-slate-50"
      on:click={close}
    >
      <XIcon class="w-4 h-4" />
    </button>
  {/if}
</div>
