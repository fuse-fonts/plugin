<script>
  import Icon from "components/Icon.svelte";
  export let enabled;
  export let text = "";
  export let settings = false;
  export let toggles = false;
</script>

<button on:click class:text={text.length > 0} class:settings class:enabled={!toggles || enabled}>
  {#if !toggles}
    <Icon icon="cached" color="var(--foreground-color)" hover="var(--foreground-color)" />
  {:else}
    <Icon 
      icon={enabled ? "check" : "check_box_outline_blank" } 
      color={enabled && settings ? "var(--foreground-color)" :"var(--muted-color)"}
      hover="var(--foreground-color)" 
    />
  {/if}
  <span class="content">
    <slot>{text}</slot>
  </span>
</button>

<style>

  .content {
    margin-left: 1rem;
    white-space: nowrap;
  }

  button.text {
    display: flex;
    align-items: center;
  }

  button.settings {
    padding: 0.75rem 1rem;
  }

  button.settings.enabled {
    background-color: var(--muted-accent-color);
    border: 1px solid var(--muted-accent-color);
  }

  button.settings:hover,
  button.settings:active {
    background-color: var(--accent-color);
    border: 1px solid var(--accent-color);
  }
</style>