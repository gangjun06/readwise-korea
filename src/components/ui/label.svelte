<script lang="ts">
  import { cn } from "src/utils/className";
  import type { HTMLLabelAttributes } from "svelte/elements";

  interface $$Props extends HTMLLabelAttributes {}
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label
  {...$$restProps}
  class={cn(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    $$restProps.class
  )}
>
  <slot />
</label>
