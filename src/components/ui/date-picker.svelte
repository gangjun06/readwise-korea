<script lang="ts">
  import { DatePicker } from "date-picker-svelte";
  import { CalendarClockIcon, CalendarDaysIcon } from "lucide-svelte";
  import Button from "./button.svelte";
  import Input from "./input.svelte";
  import { Popover } from "svelte-smooth-popover";
  import { cn } from "src/utils/className";

  interface $$Props {
    class?: string;
    date?: Date;
  }

  export let date = new Date();

  const dtf = new Intl.DateTimeFormat("ko", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const hoursList = new Array(24).fill(0).map((_, i) => i);
  const minutesList = new Array(60).fill(0).map((_, i) => i);

  $: text = dtf.format(date);

  $: selectedHours = date.getHours();
  $: selectedMinutes = date.getMinutes();

  const onChangeHours = (time: number) => {
    const newDate = new Date(date);
    newDate.setHours(time);
    date = newDate;
  };

  const onChangeMinute = (time: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(time);
    date = newDate;
  };
</script>

<div class={cn("flex gap-x-2", $$props.class)}>
  <Input bind:value={text} readonly />
  <Button variant="subtle"
    ><CalendarDaysIcon class="w-4 h-4" />
    <span class="sr-only">날짜 선택하기</span>
    <Popover showOnClick hideOnExternalClick offset={8} caretBg="transparent">
      <DatePicker bind:value={date} />
    </Popover>
  </Button>
  <Button variant="subtle"
    ><CalendarClockIcon class="w-4 h-4" />
    <span class="sr-only">시간 선택하기</span>
    <Popover showOnClick hideOnExternalClick offset={8} caretBg="transparent">
      <div
        class="bg-white drop-shadow rounded flex items-center justify-center p-4 text-center divide-x"
      >
        <div class="flex flex-col pr-2 w-12">
          <div class="pb-1 font-bold">시간</div>
          <div
            class="overflow-y-scroll h-24 hide-scroll flex flex-col text-sm text-description"
          >
            {#each hoursList as time}
              <button
                class={cn("p-1 text-right", {
                  "hover:bg-slate-100": time !== selectedHours,
                  "bg-slate-100": time === selectedHours,
                })}
                on:click={() => onChangeHours(time)}
              >
                {`${time}시`}
              </button>
            {/each}
          </div>
        </div>
        <div class="flex flex-col pl-2 w-12">
          <div class="pb-1 font-bold">분</div>
          <div
            class="overflow-y-scroll h-24 hide-scroll flex flex-col text-sm text-description"
          >
            {#each minutesList as time}
              <button
                class={cn("p-1 text-right", {
                  "hover:bg-slate-100": time !== selectedMinutes,
                  "bg-slate-100": time === selectedMinutes,
                })}
                on:click={() => onChangeMinute(time)}
              >
                {`${time}분`}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </Popover>
  </Button>
</div>
