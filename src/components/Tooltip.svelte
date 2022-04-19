<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  let open: boolean = false;
  let openFunc = () => (open = true);
  let el: HTMLElement;
  let classXTranslate: string = "-translate-x-1/2";

  if (browser) {
    onMount(() => {
      const updateXPosition = () => {
        const { right, left } = el.getBoundingClientRect();
        if (right > window.document.body.clientWidth)
          return (classXTranslate = "-translate-x-[80%]");
        if (left < 0) return (classXTranslate = "-translate-x-[20%]");
        classXTranslate = "-translate-x-1/2";
      };
      updateXPosition();
      window.addEventListener("resize", updateXPosition);

      window.document.addEventListener(
        "touchstart",
        () => open && (open = false),
        { capture: true, passive: true }
      );
    });
  }
</script>

<span class="relative inline-flex">
  <span
    class="border-b-2 border-dotted border-fuchsia-700"
    on:touchstart={openFunc}
    on:mouseenter={openFunc}
    on:mouseleave={() => (open = false)}
  >
    <slot name="main" />
  </span>
  <span
    bind:this={el}
    class:visible={open}
    class:invisible={!open}
    class={`absolute left-1/2 -mr-[200px] max-w-[180px] -translate-y-full rounded bg-fuchsia-700 py-2 px-2 text-center text-white ${classXTranslate}`}
    on:blur={() => (open = false)}
  >
    <slot name="hover" />
  </span>
</span>
