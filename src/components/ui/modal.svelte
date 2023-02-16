<script context="module">
  // Refference: https://svelte.dev/repl/92ceb8ef855346a8811f3c279061d3f6?version=3.38.2
  const modalList = [];
</script>

<script lang="ts">
  import { cx } from "cva";
  import { fade, scale } from "svelte/transition";
  import { cubicIn, cubicOut, elasticOut } from "svelte/easing";
  import { disclosureStore } from "../../disclosure-store";
  import Button from "src/components/ui/button.svelte";

  export let title: string = "";
  export let description: string = "";

  const store = disclosureStore(false);
  const { isOpen, open, close } = store;

  const onKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Escape") close();
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    const node = event.target;
    (node as HTMLDivElement).focus();
  };

  function modalAction(node: HTMLDivElement) {
    const returnFn = [];

    // for accessibility
    if (document.body.style.overflow !== "hidden") {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      returnFn.push(() => {
        document.body.style.overflow = original;
      });
    }

    node.addEventListener("keydown", onKeyDown);
    node.addEventListener("transitionend", onTransitionEnd);
    node.focus();
    modalList.push(node);

    returnFn.push(() => {
      node.removeEventListener("keydown", onKeyDown);
      node.removeEventListener("transitionend", onTransitionEnd);
      modalList.pop();
      // Optional chaining to guard against empty array.
      modalList[modalList.length - 1]?.focus();
    });

    return {
      destroy: () => returnFn.forEach((fn) => fn()),
    };
  }
</script>

<slot name="trigger" {open}>
  <button on:click={open}>Open</button>
</slot>
{#if $isOpen}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    class="fixed inset-0 z-50 flex items-start justify-center sm:items-center"
    use:modalAction
    tabindex="0"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={close}
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all"
      in:fade={{ duration: 100 }}
      out:fade={{ duration: 100 }}
    />

    <div
      class={cx(
        "fixed z-50 w-full gap-4 rounded-b-lg bg-white p-6 sm:max-w-lg sm:rounded-lg"
      )}
      in:scale={{ duration: 100, start: 0.8, easing: cubicOut }}
    >
      <slot name="header" {store}>
        <div class="text-lg font-semibold text-slate-900 dark:text-slate-50">
          <slot name="header-title">
            {title}
          </slot>
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400">
          <slot name="header-description">
            {description}
          </slot>
        </div>
      </slot>

      <div class="content py-3">
        <slot name="content" {store} />
      </div>

      <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
        <slot name="footer" {store}>
          <Button on:click={close}>닫기</Button>
        </slot>
      </div>
    </div>
  </div>
{/if}
