<script lang="ts">
  export let number: number;
</script>

<a
  class="mx-0.5 text-orange-500 dark:text-orange-400"
  href={`#${number.toString()}`}><sup>{number.toString()}</sup></a
>
