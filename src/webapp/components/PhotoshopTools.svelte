<script>
  import IconButton from "components/IconButton.svelte";
  const icons = [
    "open_with",
    "photo_size_select_small", 
    "format_paint",
    "edit",
    "colorize",
    "layers",
    "360",
    "crop",
    "title",
    "format_shapes",
    "search",
  ];

  let active = icons[0];
</script>

<div class="tools">
  {#each icons as icon}
    <div class="tool">
      <IconButton {icon} on:click="{() => active = icon}" active={active === icon} />
    </div>
  {/each}
</div>


<style>

  .tool {
    margin: 0.5rem 0;
  }

</style>