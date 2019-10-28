<svelte:window on:mousewheel|passive={zoomControl} on:message={postMessageCallback} />

<script>
  import { onMount } from "svelte";
  import { fly, slide } from "svelte/transition";
  import Icon from "components/Icon.svelte";
  import styleParser from "helpers/font-style-parser.js";
  import TypeFace from "datatypes/typeface.js";

  let selectedFamily = null;
  let selectedElement = null;
  let disclaimerClicked = true;
  let scale = 1;

  const outlineStyle = "1px dashed #999";

  const postMessageCallback = event => {

    selectedFamily = event.data || null;
    
    if (selectedElement !== null) {
      const style = TypeFace.mapFontToCSS({ style: selectedFamily.fontStyle });
      selectedElement.style = style;
      selectedElement.style.fontFamily = selectedFamily.family;
      selectedElement.style.outline = outlineStyle;
    }
  };

  function selectElement(event) {
    clearSelection();

    selectedElement = event.currentTarget;
    selectedElement.style.outline = outlineStyle;
    event.stopPropagation();
  }

  function clearSelection() {
      if (selectedElement !== null) {
        selectedElement.style.outline = "";
        selectedElement = null;
      }
  }
  
  function zoomControl(event) {
    const amount = 0.05;
    let velocityBasis = Math.abs(event.wheelDeltaY);
    if (velocityBasis <= 0) {
      velocityBasis = 1;
    }

    const velocity = velocityBasis / 120;
    
    console.log(event.wheelDeltaY, velocity);
    let direction = event.deltaY > 0 ? -1 : 1;
    let nextScale = scale + (amount * direction * velocity * velocity);
    scale = Math.min(Math.max(0.5, nextScale), 6)
  }

  </script>
<article class="canvas" on:click={clearSelection} style={`transform: scale(${scale.toFixed(2)})`}>
    <header class="canvas-hero">
      <h1 spellcheck="false" class="selectable" contenteditable="true" on:click={selectElement}>No more scrolling endlessly in the character panel seeking that font amongst thousands.</h1>
    </header>
    <section class="canvas-body">
      <p class="selectable" spellcheck="false" contenteditable="true" on:click={selectElement}>
        Fuse Fonts will streamline your productivity—making it easier than ever to organize your fonts into folders <strong>that you create</strong>.
        Stop struggling and wasting time looking for the perfect font for your design project. Time is money and stress kills creativity. 
      </p>
      <p class="selectable" spellcheck="false" contenteditable="true" on:click={selectElement}>
        Need a funny font? Open up the funny fonts folder. Looking for that perfect condensed font? You made a folder for that and they are all there. 
      </p>
    </section>
</article>

<div class="disclaimer" on:click="{ () => disclaimerClicked = !disclaimerClicked}" title={disclaimerClicked ? "Show" : "Hide"} >
  {#if !disclaimerClicked}
  <div in:fly={{ duration: 200 }}>
    <p>
      <span class="icon-container">
        <Icon icon="warning" />
      </span>
        <strong>This page is a sample application to feature Fuse Fonts functionality.</strong>
      </p>
      <p class="muted">
        The fonts listed may not be on your device, and some features won't work as they would within photoshop.
      </p>
    </div>
    {:else}
    <div in:slide={{ duration: 200 }}>
      <Icon icon="warning" />
    </div>
    {/if}
</div>
<style>

  .canvas {
    --sassy-color: #34b77b;
    width: 480px;
    height: 800px;
    background-color: #fafafa;
    
    border: var(--panel-border);
    color: #000;
    font-size: 1.6rem;
    overflow: hidden;
    line-height: 1.816em;
  }

  .disclaimer {
    cursor: pointer;
    border-radius: 6px;
    position: fixed;
    bottom: 3rem;
    left: 8rem;
    background-color: var(--notifications-panel);
    padding: 1.5rem 2rem;
  }

  .disclaimer p {
    margin: 0 0 1rem 0;
  }



  .muted {
  color: var(--muted-color);
}

  .icon-container {
    display: inline-block;
    margin-right: 1rem;
    margin-left: 1rem;
  }

  .canvas-hero,
  .canvas-body {
    padding: 1rem 2rem;
  }

  .canvas-hero {
    background-color: #fff;
    padding: 2rem 2rem 0rem 2rem;
  }

  .canvas-body {
    
  }

  h1 {
    color: var(--sassy-color);
    margin: 0 0 1rem 0;
    font-size: 4rem;
    line-height: 1.15em;
  }

  p {
    margin: 0 0 1rem 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  .selectable {
    outline: 2px solid transparent;
    outline-offset: 1px;
  }

  .selectable:hover {
    outline: 2px dashed #f2f2f2;
    cursor: text;
    text-decoration: underline;
  }


</style>