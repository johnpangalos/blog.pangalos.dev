<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  let open: boolean = false;
  let openFunc = () => (open = true);
  let el: HTMLElement;
  let elMain: HTMLElement;
  let classXTranslate: string = "-translate-x-1/2";
  let offset = 0;

  if (browser) {
    onMount(() => {
      const updateXPosition = () => {
        const { right, left } = el.getBoundingClientRect();
        const { width } = elMain.getBoundingClientRect();
        const windowWidth = window.document.body.clientWidth;

        if (right > windowWidth - 12) {
          offset = right - windowWidth + 132 + 12;
          classXTranslate = "";
        } else if (left < 12) {
          offset = Math.ceil(width) / 2;
          classXTranslate = "";
        } else classXTranslate = "-translate-x-1/2";
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
    bind:this={elMain}
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
    class={`absolute left-1/2 -mr-[270px] max-w-[250px] -translate-y-full rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white ${classXTranslate}`}
    style={`${offset !== 0 ? `transform: translate(-${offset}px, -100%)` : ""}`}
    on:blur={() => (open = false)}
  >
    <slot name="hover" />
  </span>
</span>
