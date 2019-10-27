
<section on:dragstart={dragStart} on:dragover={dragOver} on:dragend={dragEnd} on:drop={dragEnd}>
  <slot></slot>
</section>

{#if dragging}
  <div class="selection" class:dragging bind:this={dragGhostElement} transition:scale={{ duration: 200 }}>  
    <span class="selection-icon">
      <Icon icon="text_fields" color="var(--selected-color)" />
    </span>
    {dragMessage($selected)}
  </div>
{/if}

<style>
  .selection {
    display: none;
    top: -50%;
    position: fixed;
    background-color: var(--accent-color);
    color: var(--selected-color);
    width: auto;
    padding: 0.5rem 1rem 0.5rem 0.5rem;
    pointer-events: none;
    border-radius: 3px;
    z-index: 999;
  }

  .selection-icon {
    display: inline-block;
    margin-right: 0.5rem;
  }

  .selection.dragging {
    display: block;
  }
</style>

<script>
  import Icon from "components/Icon.svelte";
  import { selected } from "stores/font-selection.js";
  import { onMount } from "svelte";
  import { scale } from 'svelte/transition';

  // dom node
  let dragGhostElement;
  let dragImageElement = new Image();

  // state
  let dragging = false;
  let mouseX = 0;
  let mouseY = 0;

onMount(() => {

  // offscreen canvas not supported in CEP yet
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  dragImageElement.src = canvas.toDataURL("image/png");

})

function dragMessage(selection) {
  const items = Object.keys(selection);
  const length = items.length;
  const firstItem = items[0];

  return (length === 1 ? firstItem : `${length} TypeFaces`);
}

function updateMousePositions(e) {
  mouseX = e.clientX - 10;
  mouseY = e.clientY - 10;
}

function dragStart(e) {
  updateMousePositions(e);
  dragging = true;
  e.dataTransfer.setDragImage(dragImageElement, 0, 0)
}

function dragOver(e) {
  dragging = true;
  updateMousePositions(e);

  if (dragGhostElement) {
    dragGhostElement.style.top = `${mouseY}px`;
    dragGhostElement.style.left = `${mouseX}px`;

  }

}

function dragEnd(e) {
  dragging = false;
  mouseX = 0;
  mouseY = 0;
}

</script>