<svelte:body on:mouseleave={resizeEnd}/>
<!-- <svelte:window on:resize={throttle(containerResize, 50, true)} /> -->


<main bind:this={root} class:resizing style="--top-panel-height: {split}%; ">
    
    {#if resizing}
    
      <section class="overlay" style="top: {split / 2}%;">
        <b>{split}%</b> {topPaneHeight}px
      </section>
      <section class="overlay" style="top: {split + ((100 - split) / 2)}%;">
        <b>{100 - split}%</b> {bottomPaneHeight}px
      </section>
    
    {/if}

  <section class="panel top-panel">
    <slot name="top" class="slot"></slot>
  </section>

  <section class="separator" bind:this={seperator} on:mousedown={resizeStart}>
    <div class="handle"></div>
  </section>

  <section class="panel bottom-panel">
    <slot name="bottom" class="slot"></slot>
  </section>

</main>

<style>

  main {
    --total-height: 100vh;
    --top-panel-height: 25%;
    --seperator-height: 7px;
    --bottom-panel-height: calc((100% - var(--top-panel-height)) - var(--seperator-height));
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: var(--total-height);
    /* max-height: var(--total-height); */
  }

  .overlay {
    font-size: 1rem;
    pointer-events: none;
    z-index: 10;
    position: absolute;
    top: 2.5%;
    right: 50%;
    padding: 0.25rem 1rem;
    transform: translateX(50%);
    color: var(--muted-color);
    background-color: var(--panel-layer-0);
    border-radius: 0.5rem;
    text-align: center;
    opacity: 0.8;
  }

  .overlay b {
    color: var(--foreground-color);
    font-weight: 600;
    display: inline-block;
    margin-right: 1rem;
  }

  .slot {
    height: 100%;
  }

  .resizing {
    cursor: row-resize !important;
  }

  .resizing > .panel {
    pointer-events: none;
    user-select: none;
  }


  .separator {
    width: 100%;
    height: var(--seperator-height);
    overflow-y: hidden;
    background-color: var(--panel-layer-0);
    /* border: 1px solid #000; */
    border-left: none;
    border-right: none;
    user-select: none;
  }

  .separator .handle {
    width: 16px;
    /* border-bottom: 1px dotted #000;
    border-top: 1px dotted #000; */
    height: 2px;
    margin: 0 auto;
    margin-top: 1px;
  }

  .separator:hover {
    cursor: row-resize;
    
  }

  .separator:active {
    cursor: row-resize;
    background-color: var(--accent-color);
    border-color: var(--accent-color);
  }

  .separator:hover .handle {
    width: 32px;
    border-color: var(--panel-layer-2);
    transition: 0.2s ease-out all;
  }

  .separator:active .handle{
    border-bottom: 1px dotted transparent;
    border-top: 1px dotted transparent;
  }

  .top-panel {
    height: var(--top-panel-height);
  }

  .bottom-panel {
    height: var(--bottom-panel-height);
  }

</style>

<script>

  import { onMount, } from "svelte";
  import { isPhotoshop } from "stores/app-settings.js";
  import { settings } from "stores/user-settings.js";
  import { throttle } from "helpers/utils.js";

  // exports
  export let height = window.innerHeight;
  export let split = 50;
  export const seperatorHeight = 7;
    
  const minPanelSize = 180;
  $: min = minPanelSize / height;
  $: max = 1 - (minPanelSize / height);
  $: topPaneHeight = calcTopPanel(split);
  $: bottomPaneHeight = calcBottomPanel(split);
  
  // if height changes, we update split and everything else
  $: updateSplit(height);

  
  // dom references
  let root;
  let seperator;
  
  //helpers
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  
  // reactive and stateful vars
  let resizing = false;
  

  const resizeStart = (e) => {
    if (!$isPhotoshop) return;
    root.addEventListener("mousemove", resizeMove);
    root.addEventListener("mouseup", resizeEnd);
    resizing = true;
  };

  const resizeEnd = (e) => {
    root.removeEventListener("mousemove", resizeMove);
    root.removeEventListener("mouseup", resizeEnd);
    resizing = false;
  }

  const resizeMove = (e) => {
    let percent = (e.clientY / height);
    split = Math.round(clamp(percent, min, max) * 100);

    settings.setSplit(split);
    
  };

  const setSeperator = (value) => {
    
    root.style.setProperty("--top-panel-height", `${clampedValue}%`)
    
  };

  function calcTopPanel(value) {
    return Math.round(height * (value / 100));
  }

  function calcBottomPanel(value) {
    return Math.round((height * (1 - (value / 100)) - seperatorHeight));
  }

  function updateSplit(h) {
    
    const percent = split / 100;
    split = Math.round(clamp(percent, min, max) * 100);
    settings.setSplit(split);
  }

</script>