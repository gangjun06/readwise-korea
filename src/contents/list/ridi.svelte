<script lang="ts">
  import {
    Button,
    Input,
    Switch,
    Modal,
    Label,
    DatePicker,
  } from "src/components/ui/index";
  import Card from "src/components/card.svelte";
  import { chromeSendBackgroundMessage } from "src/utils/events-chrome";
  import Pagination from "src/components/pagination.svelte";
  import type { RidiBookList } from "src/background/ridi";
  import { onMount } from "svelte";
  import { HighlighterIcon } from "lucide-svelte";

  export let ready = false;
  export let statusText = "알 수 없음";

  const data: Map<number, RidiBookList> = new Map();

  let displayList = [];

  let currentPage = 1;
  let maxPage = 1;

  const dtf = new Intl.DateTimeFormat("ko", {
    dateStyle: "full",
    timeStyle: "short",
  });

  let selectedBook: RidiBookList["result"][0] | null = null;

  $: description = selectedBook
    ? "다음 목록을 리드와이즈로 내보냅니다."
    : "가져오고 싶은 독서노트가 있는 책을 선택해주세요.";

  onMount(() => {
    chromeSendBackgroundMessage("ridi/books", { page: 1 }).then((res) => {
      data.set(1, res);
      displayList = res.result;
      maxPage = res.pages;
    });
  });

  $: {
    const exists = data.get(currentPage);
    if (exists) {
      displayList = exists.result;
    } else {
      displayList = [];
      chromeSendBackgroundMessage("ridi/books", { page: currentPage }).then(
        (res) => {
          data.set(currentPage, res);
          displayList = res.result;
        }
      );
    }
  }

  const exportHighlights = async () => {
    if (!selectedBook) return;
    const _ = await chromeSendBackgroundMessage("ridi/create", {
      bookId: selectedBook.bookId,
      count: selectedBook.highlightCount,
    });

    selectedBook = null;
  };
</script>

<Card
  name="리디북스"
  isReady={ready}
  lastExport="-"
  {statusText}
  url="https://ridibooks.com"
>
  <svelte:fragment slot="modal-description">
    {description}
  </svelte:fragment>
  <svelte:fragment slot="modal-content">
    {#if !selectedBook}
      <div class="grid gird-flow-col gap-y-2">
        {#if displayList.length < 1}
          <div>로딩중...</div>
        {:else}
          {#each displayList as item}
            <button
              class="flex gap-x-4 hover:bg-secondary rounded-lg border border-default text-left w-full items-center"
              on:click={() => (selectedBook = item)}
            >
              <img src={item.image} alt="" class="w-12 rounded-l-lg" />
              <div class="flex-col py-3 text-description">
                <div class="text-title font-bold">
                  {`${item.title} - ${item.author}`}
                </div>
                <div>
                  {`하이라이트 - ${item.highlightCount} | 메모 - ${item.memoCount}`}
                </div>
              </div>
            </button>
          {/each}
        {/if}
      </div>
      <Pagination bind:currentPage bind:maxPage class="mt-4" />
    {:else}
      <div
        class="flex gap-x-4 bg-secondary rounded-lg border border-default text-left w-full items-center"
      >
        <img src={selectedBook.image} alt="" class="w-12 rounded-l-lg" />
        <div class="flex-col py-3 text-description">
          <div class="text-title font-bold">
            {`${selectedBook.title} - ${selectedBook.author}`}
          </div>
          <div>
            {`하이라이트 - ${selectedBook.highlightCount} | 메모 - ${selectedBook.memoCount}`}
          </div>
        </div>
      </div>
      <div
        class="grid gird-flow-col gap-y-2 divide-y divide-default mt-2 max-h-96 overflow-y-scroll"
      >
        {#await chromeSendBackgroundMessage( "ridi/highlight-preview", { bookId: selectedBook.bookId } )}
          <div>불러오는 중...</div>
        {:then data}
          {#each data.annotations as item}
            <div class="text-description py-2 flex gap-x-2">
              <HighlighterIcon class="w-4 h-4" />
              <div>
                <p class="text-base text-default">
                  {item.selected_text}
                </p>
                <div class="text-sm text-description">
                  {dtf.format(new Date(item.created_at))}
                </div>
              </div>
            </div>
          {/each}
          {#if selectedBook.highlightCount > 10}
            <div class="text-base text-default text-center py-2">
              {`${
                selectedBook.highlightCount - 10
              } 개의 하이라이트가 더 있습니다`}
            </div>
          {/if}
        {/await}
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="modal-footer" let:store={{ close }}>
    {#if !selectedBook}
      <Button on:click={close} variant="outline">취소</Button>
    {:else}
      <Button on:click={() => (selectedBook = null)} variant="outline"
        >이전</Button
      >
      <Button
        on:click={() => {
          exportHighlights().then(() => {
            close();
          });
        }}>내보내기</Button
      >
    {/if}
  </svelte:fragment>
</Card>

<!-- <div class="grid gap-4 py-4">
      <div class="grid grid-cols-5 items-center gap-4">
        <Label for="username" class="text-right col-span-1">시작 날짜</Label>
        <Switch class="col-span-1" bind:checked={useStartDate} />
        <Label for="username" class="text-right col-span-1">종료 날짜</Label>
        <div class="col-span-2 flex gap-x-2 items-center">
          <Switch bind:checked={useEndDate} />
          {#if !useEndDate}
            <div class="text-description text-sm">기본값: 현재날짜</div>
          {/if}
        </div>
      </div>
      {#if useStartDate}
        <div class="grid grid-cols-5 items-center gap-4">
          <Label for="username" class="text-right">시작 날짜</Label>
          <DatePicker class="col-span-4" />
        </div>
      {/if}
      {#if useEndDate}
        <div class="grid grid-cols-5 items-center gap-4">
          <Label for="username" class="text-right">종료 날짜</Label>
          <DatePicker class="col-span-4" />
        </div>
      {/if}
    </div> -->
