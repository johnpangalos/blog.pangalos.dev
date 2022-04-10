<script lang="ts">
  import { browser } from "$app/env";
  let open: boolean = false;
  let openFunc = () => (open = true);

  if (browser) {
    window.document.addEventListener(
      "touchstart",
      () => open && (open = false),
      { capture: true, passive: true }
    );
  }
</script>

<span class="relative inline-block">
  <span
    class="border-b-2 border-dotted border-fuchsia-700"
    on:touchstart={openFunc}
    on:mouseenter={openFunc}
    on:mouseleave={() => (open = false)}
  >
    <slot name="main" />
  </span>
  {#if open}
    <span
      class="absolute left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-fuchsia-700 px-2 text-center text-white"
      on:blur={() => (open = false)}
    >
      <slot name="hover" />
    </span>
  {/if}
</span>
