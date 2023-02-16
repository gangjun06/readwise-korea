<script lang="ts">
  import { cn } from "src/utils/className";

  interface $$Props {
    checked?: boolean;
    class?: string;
  }

  export let checked = false;
</script>

<button
  class={cn(
    "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=unchecked]:bg-slate-200 data-[state=checked]:bg-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=unchecked]:bg-slate-700 dark:data-[state=checked]:bg-slate-400",
    $$props.class
  )}
  role="switch"
  data-state={checked ? "checked" : "unchecked"}
  aria-checked={checked}
  on:click={() => (checked = !checked)}
>
  <span
    data-state={checked ? "checked" : "unchecked"}
    class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5"
  />
</button>

<style>
</style>
