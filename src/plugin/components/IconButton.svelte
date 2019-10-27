<button title={title} {disabled} on:click class:active >
  <Icon {icon} {disabled} />
</button>


<style>

  button {
    
  }

  button[disabled] {
    opacity: 0.75 !important;
    user-select: none !important;
    pointer-events: none !important;
    
  }

  button[disabled] i {
    color: var(--panel-layer-0);
  }

  button.active {
    background-color: var(--panel-layer-0);
  }
</style>

<script>

  import Icon from "components/Icon.svelte";

  export let icon = "report";
  export let title = "";
  export let disabled = false;
  export let active = false;
</script>