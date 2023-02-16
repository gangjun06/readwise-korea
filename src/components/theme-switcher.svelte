<script>
  import { MoonIcon, SunIcon } from "lucide-svelte";
  import { onMount } from "svelte";
  import { Switch } from "./ui";

  let checked = false;
  let initialized = false;

  const getThemeCurrent = () => document.documentElement.dataset.theme;

  onMount(() => {
    checked = getThemeCurrent() === "dark";
    initialized = true;
  });

  $: {
    if (initialized) {
      const theme = checked ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    }
  }
</script>

<div class="flex gap-x-2 items-center justify-center">
  <SunIcon class="w-4 h-4" />
  <Switch bind:checked />
  <MoonIcon class="w-4 h-4" />
</div>
