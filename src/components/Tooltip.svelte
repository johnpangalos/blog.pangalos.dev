<script lang="ts">
  let open: boolean = false;
  let ref: HTMLDivElement;

  let openFunc = () => {
    open = true;
  };
  window.document.addEventListener("touchstart", (event) => {
    if (!ref.contains(event.target as HTMLElement)) {
      open = false;
    }
  });
</script>

<div class="relative inline-block">
  <div
    class="border-b-2 border-dotted border-fuchsia-700"
    on:touchstart={openFunc}
    on:mouseenter={openFunc}
    on:mouseleave={() => (open = false)}
  >
    <slot name="main" />
  </div>
  {#if open}
    <div
      class="absolute left-1/2 -mt-9 inline-block -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-fuchsia-700 px-2 text-center text-white after:absolute after:-ml-[4px] after:translate-x-1/2 after:border-4 after:border-b-0 after:border-transparent after:border-t-fuchsia-700 after:content-['']"
      on:blur={() => (open = false)}
      bind:this={ref}
    >
      <slot name="hover" />
    </div>
  {/if}
</div>
