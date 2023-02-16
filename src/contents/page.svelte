<script>
  import { HelpCircleIcon, InfoIcon } from "lucide-svelte";
  import ThemeSwitcher from "src/components/theme-switcher.svelte";
  import Button from "src/components/ui/button.svelte";
  import { toast } from "src/components/ui/toast/store";
  import Toasts from "src/components/ui/toast/toasts.svelte";
  import { cn } from "src/utils/className";
  import { chromeSendBackgroundMessage } from "src/utils/events-chrome";
  import "../index.css";
  import Ridi from "./list/ridi.svelte";

  let isReady = false;
</script>

<Toasts />
<div class="w-full h-full flex flex-col bg-secondary text-default">
  <header
    class="h-[30%] min-h-[170px] flex flex-col w-full items-center justify-center shadow-inner"
  >
    <h1 class="text-4xl text-title font-bold block">Readwisee Importer</h1>
    <div class="text-offset mt-0.5 text-sm flex items-center justify-center">
      <InfoIcon class="mr-1 h-3 w-3" />
      Verseion 0.1.0
    </div>

    <div class="flex divide-x-2 divide-default mt-4 text-default">
      <a class="px-3" href="https://example.com">크롬 웹 스토어</a>
      <a class="px-3" href="https://example.com">소스코드</a>
      <a class="px-3" href="https://example.com">개발자 후원하기</a>
    </div>
    <div class="mt-4">
      <ThemeSwitcher />
    </div>
  </header>
  <a
    class="fixed bottom-12 right-12 rounded-full bg-slate-700 px-3 py-3 drop-shadow-lg text-white"
    target="_blank"
    rel="noreferrer"
    href="https://example.com"
  >
    <HelpCircleIcon class="w-8 h-8" />
  </a>
  <main class="h-full rounded-t-3xl bg-default py-[5%]">
    <div class="mx-auto max-w-6xl px-4">
      {#await chromeSendBackgroundMessage("status", {})}
        <div>Loading...</div>
      {:then data}
        <div
          class="w-full rounded-full bg-card border border-default px-8 py-5 text-sm flex gap-x-4 shadow-inner"
        >
          <div class="text-lg">Readwise</div>
          <div class="flex items-center jusityfy-cenater gap-x-2">
            <div
              class={cn(
                "rounded-full w-2 h-2",
                data["readwise"].ready ? "bg-green-400" : "bg-red-400"
              )}
            />
            {!data["readwise"].ready ? data["readwise"].message : "준비완료"}
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 mt-8">
          <Ridi
            ready={data["ridibooks"]?.ready}
            statusText={data["ridibooks"]?.message}
          />
          <!-- <Card
            name="YES24"
            isReady={false}
            lastExport="-"
            statusText="로그인 필요"
            url="https://example.com"
          />
          <Card
            name="교보문고"
            isReady={false}
            lastExport="-"
            statusText="로그인 필요"
            url="https://example.com"
          />
          <Card
            name="알라딘"
            isReady={false}
            lastExport="-"
            statusText="로그인 필요"
            url="https://example.com"
          />
          <Card
            name="밀리의 서재"
            isReady={false}
            lastExport="-"
            statusText="로그인 필요"
            url="https://example.com"
          /> -->
        </div>
      {/await}
    </div>
  </main>
</div>

<style>
</style>
