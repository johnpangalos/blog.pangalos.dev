<script lang="ts">
  export let to: string;
  let className: string;

  export { className as class };
</script>

<a
  class={`-mx-0.5 p-0.5 text-orange-600 no-underline transition-all duration-200 hover:bg-orange-600 hover:text-white dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-slate-700${
    className ? ` ${className}` : ""
  }`}
  href={to}
  target="_blank"><slot /></a
>
