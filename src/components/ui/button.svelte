<script lang="ts">
  import { cva } from "cva";
  import { Loader2 } from "lucide-svelte";
  import { cn } from "src/utils/className";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface $$Props extends HTMLButtonAttributes {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "subtle"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg";
    isLoading?: boolean;
  }

  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export let isLoading = false;

  export const buttonVariants = cva(
    cn(
      "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
      "data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none",
      $$props.class
    ),
    {
      variants: {
        variant: {
          default:
            "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
          destructive:
            "bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
          outline:
            "bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100",
          subtle:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100",
          ghost:
            "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
          link: "bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent",
        },
        size: {
          default: "h-10 py-2 px-4",
          sm: "h-9 px-2 rounded-md",
          lg: "h-11 px-8 rounded-md",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  );
</script>

<button
  on:click
  {...$$restProps}
  class={buttonVariants({ variant, size })}
  disabled={isLoading || $$props.disabled}
>
  {#if isLoading}
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  {/if}

  <slot />
</button>
