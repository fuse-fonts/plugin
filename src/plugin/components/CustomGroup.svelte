<article class="group" 
  class:selected 
  class:drophover 
  class:editing
  on:click={clickHandler} 
  on:dblclick={startEditing}
  on:dragover={dragOver} 
  on:dragleave={dragEnd}
  on:drop={drop}
  bind:this={el}
  
>
{#if editing}
  <Icon color="var(--accent-color)" icon="edit" blink={true} />
  <GroupNameInput 
    group={group} 
    value={group.name}
    on:cancel={stopEditing}
    on:change={stopEditing} />
{:else}
  
  <Icon 
    color={iconColor} 
    icon={group.permanent ? "text_format" : dropped ? "done" : "folder" } />

  <h1 class:tiled class="group-name">{group.name}</h1>
{/if}
</article>

<style>

  .group {
    padding: 0 0 0 0.5rem;
    margin: 0 0;
    cursor: default;
    width: 100%;
    border-radius: 0px;
    transition: 0.2s ease-out all;
    position: relative;
    background-color: transparent;
    display: flex;
    flex: 0 1 auto;
    justify-content: space-between;
    border: 1px solid transparent;
    align-items: center;
  }

  .group:hover {
    background-color: var(--panel-layer-2);
  }

  .group.selected {
    background-color: var(--accent-color);
    position: sticky;
    top: 0rem;
    bottom: 0;
    z-index: 2;
  }

  .group:active {
    background-color: var(--accent-color);
  }

  .group.editing {
    /* padding: 0.5rem 1rem; */
    background-color: var(--panel-layer-0);
    color: var(--foreground-color);
    transition: 0.2s ease-out all;
    /* box-shadow: 0px 0px 8px var(--accent-color) inset; */
    border: 1px solid var(--accent-color);
  }

  .group-name {
    width: 100%;
    padding: 0.5rem 1rem;
    margin: 0 0;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 400;
  }

  .group-name.tiled {
    font-size: 0.8rem;
  }

  .drophover {
    border: 1px solid var(--accent-color);
  }

</style>

<script>
  
  import Icon from "components/Icon.svelte";
  import GroupNameInput from "components/GroupNameInput.svelte";
  import { highlight } from "helpers/animations.js";

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let el = null;
  export let group = null;
  export let selected = false;
  export let editing = false;
  export let tiled = false;

  $: iconColor = drophover ? "var(--selected-color)" : group.color;

  let dropped = false;

  export const DROPPED_EVENT = "dropped";

  let drophover = false;

  function clickHandler(e) {

    if (!selected) {
      dispatch("select", group);
    }
  }

  function startEditing(e) {
    if (group.permanent) return;
    editing = true;
  }

  function stopEditing(e) {
    editing = false;
  }
  
  function dragOver(e) {
    if (!selected && !group.permanent) {
      drophover = true;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
    else {
      e.dataTransfer.dropEffect = "none";
    }
  } 

  function dragEnd() {
    drophover = false;
  }

  function drop(e) {
    dragEnd();
    dropped = true;
    const options = { duration: 800, delay: 0, easing: 'ease-out', };
    highlight(el, "var(--success-color)", options, () => dropped = false);
    dispatch(DROPPED_EVENT, group.ID);
  }

</script>