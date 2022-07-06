<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/env";
  import Link from "./Link.svelte";

  export let to: string = "";

  let open: boolean = false;
  let openFunc = () => (open = true);
  let el: HTMLElement;
  let elMain: HTMLElement;
  let classXTranslate: string = "-translate-x-1/2";
  let offset = 0;
  let isMobile = false;

  if (browser) {
    isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

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
        (event: TouchEvent) => {
          if (el.contains(event.target as Node)) return;
          console.log(event.target);
          open && (open = false);
        },
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
    {#if to && !isMobile}
      <Link class="no-underline" {to}>
        <slot name="main" />
      </Link>
    {:else if to}
      <span class="font-medium text-orange-600 dark:text-orange-400">
        <slot name="main" />
      </span>
    {:else}
      <slot name="main" />
    {/if}
  </span>
  <span
    bind:this={el}
    class:visible={open}
    class:invisible={!open}
    class={`absolute left-1/2 -mr-[270px] max-w-[250px] -translate-y-full rounded bg-fuchsia-700 p-2 text-center text-sm leading-5 text-white ${classXTranslate}`}
    style={`${offset !== 0 ? `transform: translate(-${offset}px, -100%)` : ""}`}
    on:blur={() => (open = false)}
  >
    {#if to && isMobile}
      <a class="text-white underline" href={to} target="_blank">
        <slot name="hover" />
      </a>
    {:else}
      <slot name="hover" />
    {/if}
  </span>
</span>
