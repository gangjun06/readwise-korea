<script lang="ts">
  import Toast from "./toast.svelte";

  import { toasts } from "./store";
</script>

{#if $toasts}
  <div
    class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-auto sm:top-0 sm:right-0 sm:flex-col md:max-w-[420px]"
  >
    {#each $toasts as toast (toast.id)}
      <Toast
        id={toast.id}
        title={toast.title}
        description={toast.description}
        closable={toast.closable}
      />
    {/each}
  </div>
{/if}
