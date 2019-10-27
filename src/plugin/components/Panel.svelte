<section class="panel" style="height: {height};">
    {#if title !== null}
      <h1>{title}</h1>
    {/if}
    <slot>
      
    </slot>
</section>

<script>
  export let title = null;
  export let height = "100%";
</script>