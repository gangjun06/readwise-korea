<script lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";
  import { cn } from "src/utils/className";
  import Button from "./ui/button.svelte";
  import Input from "./ui/input.svelte";

  interface $$Props {
    class?: string;
    maxPage?: number;
    currentPage?: number;
  }

  export let maxPage = 1;
  export let currentPage = 1;

  let inputValue = currentPage.toString();

  $: inputValue = currentPage.toString();

  const onChange = (evt: InputEvent) => {
    //@ts-ignore
    const value: number = parseInt(evt.target.value);
    currentPage = Math.max(Math.min(value, maxPage), 0);
  };
</script>

<div class={cn("flex justify-center", $$props.class)}>
  <div class="flex justify-center gap-x-2 w-fit">
    <Button
      variant="outline"
      class=""
      disabled={currentPage <= 1}
      on:click={() => currentPage--}
    >
      <ChevronLeftIcon class="w-6 h-6" />
    </Button>
    <Input
      class="w-16 text-center no-spin"
      type="number"
      bind:value={inputValue}
      on:change={onChange}
    />
    <Button
      variant="outline"
      class=""
      disabled={currentPage >= maxPage}
      on:click={() => currentPage++}
    >
      <ChevronRightIcon class="w-6 h-6" />
    </Button>
  </div>
</div>
