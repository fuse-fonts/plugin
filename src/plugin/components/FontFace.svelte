<div class="font" 
  class:selected 
  draggable={true}
  on:click={setEventData} 
  on:dragstart={setEventData}
  on:click
  on:dragstart
>

<header class="font-row">
  <h1 class="name">{name}</h1>
  <div class="actions">
      {#if $displayPreview}
        <TypefacePreview {font} />
      {/if}
      {#if !isLocked}
        <div title="Remove {font.font.name}">
          <Icon icon="remove"
            color="var(--muted-color)" 
            hover="var(--foreground-color)" 
            on:click={removeFontFace} />
        </div>
      {/if}
    </div>
  </header>
</div>

<style>
  .font {
    padding: 0.5rem 1rem 0.5rem 2rem;
    position: relative;
    background-color: var(--panel-item);
    border-bottom: var(--panel-border);
    border-bottom-width: 2px;
  }

  .font header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    flex: 0 1 auto;
  }

  .font:hover {
    background-color: var(--panel-item-hover);
    cursor: default;
    user-select: none;
  }

  .font.selected {
    background-color: var(--muted-accent-color);
    color: var(--selected-color);
    transition: 0.1s ease-out background-color;
  }

  .font.selected:hover {
    background-color: var(--selected-background);
  }

  .name {
    font-size: 1.2rem;
    margin: 0 0 0 0.5rem;
    font-weight: 400;
  }

  .subtext {
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.5px;
    margin: 0 1rem;
    color: var(--muted-color);
    user-select: none;
  }

  .actions {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
  }

</style>

<script>

  import Icon from "components/Icon.svelte";
  import TypefacePreview from "components/TypefacePreview.svelte";
  import { displayPreview } from "stores/preview-fonts.js";

  import { getContext } from "svelte";
  import { removeFontFace as removeFontFromGroup } from "stores/custom-groups.js";

  export let font = null;
  export let isLocked = false;
  $: name = font.description;
  export let selected = false;
  export let showPreview = false;

  const selectedGroup = getContext("selectedGroup");

  function setEventData(e) {
    e.data = { font, selected };
  }

  function removeFontFace(e) {
    e.preventDefault();
    e.stopPropagation();
    removeFontFromGroup(selectedGroup.ID, font.font.family, font.name);
  }

</script>