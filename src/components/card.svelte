<script lang="ts">
  import { Button, Modal } from "src/components/ui/index";
  import { ExternalLinkIcon, EyeIcon, FolderOutputIcon } from "lucide-svelte";
  import { cn } from "src/utils/className";

  const handleOnClick = () => {
    console.log("A");
  };

  export let name: string;
  export let lastExport: string;
  export let isReady: boolean;
  export let statusText: string;
  export let url: string = "";
</script>

<div class="w-full rounded-lg bg-card border border-default">
  <div
    class="bg-card-header rounded-t-lg px-3 py-2 border-b border-default flex justify-between items-center"
  >
    <div class="text-lg">{name}</div>
    <a href={url} target="_blank" rel="noreferrer">
      <ExternalLinkIcon class="w-4 h-4" />
    </a>
  </div>
  <div class="px-4 py-5 text-sm">
    <div class="flex justify-between">
      <div>마지막 내보내기</div>
      <div>{lastExport}</div>
    </div>
    <div class="mt-4 flex justify-between items-center">
      <div class="flex items-center jusityfy-cenater gap-x-2">
        <div
          class={cn(
            "rounded-full w-2 h-2",
            isReady ? "bg-green-400" : "bg-red-400"
          )}
        />
        {isReady ? "준비완료" : statusText}
      </div>
      <div class="flex gap-x-2">
        <Button on:click={handleOnClick} variant="outline" size="sm">
          <EyeIcon class="h-4 w-4" />
        </Button>

        <Modal title="리디북스">
          <svelte:fragment slot="header-description">
            <slot name="modal-description" />
          </svelte:fragment>

          <Button
            slot="trigger"
            let:open
            on:click={open}
            variant="outline"
            size="sm"
            disabled={!isReady}
          >
            <FolderOutputIcon class="mr-2 h-4 w-4" />
            내보내기
          </Button>
          <svelte:fragment slot="content" let:store>
            <slot name="modal-content" />
          </svelte:fragment>
          <svelte:fragment slot="footer" let:store>
            <slot name="modal-footer" {store} />
          </svelte:fragment>
        </Modal>
      </div>
    </div>
  </div>
</div>
