<script context="module">
  // const text = "The quick brown fox";
  let contrastClass = ""; // options: "high-contrast" "mid-contrast"
</script>

<script>
  import { fly, slide, scale } from "svelte/transition";

  export let font;

  let family = font.font.family;
  let cssProperties = font.cssProperties || "";
  let style = `font-family: ${family}; ${cssProperties}`;
  const text = family;

</script>

<div class="typeface-preview-container"> 
  <div class="typeface-preview {contrastClass}" {style}>{text}</div>
</div>


<style>

  .typeface-preview-container {
    text-align: right;
    --fg-color: var(--foreground-color);
    --bg-color: var(--panel-layer-0);
    --bg-color: transparent;
    --preview-size: 3vw;
    --arrow-size: 0.75rem;
    --padding: 1rem;
    --padding-size: calc(var(--padding) + 1px);
    --padding-y: calc(var(--padding-size) * 2);
    max-width: 60vw;
  }

  .typeface-preview {
    line-height: 1em;
    font-size: var(--preview-size);
    background-color: var(--bg-color);
    color: var(--fg-color);
    padding: 1rem var(--padding-size);
    margin: 0rem 0rem;
    margin-top: auto;
    white-space: nowrap;
    overflow: hidden;
    font-weight: auto;
    
    font-variant-ligatures: normal;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }


  .high-contrast {
    --fg-color: var(--panel-layer-0);
    --bg-color: var(--foreground-color);
  }

  .mid-contrast {
    --fg-color: var(--panel-layer-0);
    --bg-color: var(--foreground-color);
  }


</style>