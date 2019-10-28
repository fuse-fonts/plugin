<script>
  import Icon from "components/Icon.svelte";
  import IconButton from "components/IconButton.svelte";
  import PhotoshopCanvas from "components/PhotoshopCanvas.svelte";
  import PhotoshopTools from "components/PhotoshopTools.svelte";
  import ThemeSelect from "components/ThemeSelect.svelte";

  import { onMount } from "svelte";

  const pluginSizes = [370, 600];

  let pluginWidth = pluginSizes[0];
  let pluginHeight = 800;
  let renderIframe = false;
  let container = null;
  let expanded = false;

  function calculatePluginSize() {
      pluginHeight = container.offsetHeight;
  }

  function togglePluginSize() {
    if (expanded) {
      pluginWidth = pluginSizes[0];
    }
    else {
      pluginWidth = pluginSizes[1];
    }
    expanded = !expanded;
  }

  onMount(() => {
    if (container !== null) {
      renderIframe = true;
      calculatePluginSize();
    }
    
    return () => {
      renderIframe = false;
      container = null;
    }
  });

</script>


<section class="workspace" style={`--plugins-size: calc(${pluginWidth}px + 2rem);`}>
  <div class="workspace-tools">
    <PhotoshopTools />
  </div>
  <div class="workspace-background">

    <nav class="document-tabs">
      <ol>
        <li>
          <span>
            document_final.psd (Background, RGB/8#)
          </span>
          <span class="icon">
            <Icon icon="close" />
          </span>
        </li>
      </ol>
    </nav>

    <div class="workspace-canvas-container">
      <PhotoshopCanvas />
    </div>
  </div>
  <aside class="workspace-panels">
    <div class="panel-title">Fuse Fonts</div>
    <div class="panel" bind:this={container}>
      {#if renderIframe}
        <iframe src="/plugin.html" title="Fuse Fonts Plugin" width={pluginWidth} height={pluginHeight}></iframe>
      {/if}
    </div>
    <div class="panel-footer">
      
        <button class="panel-expander" title={expanded ? "Show compact size" : "Show expanded size"} on:click={togglePluginSize}>
          <Icon icon={expanded ? "arrow_right" : "arrow_left"} />
        </button>
      
      <ThemeSelect />
    </div>
  </aside>
</section>


<style>

  iframe {
    border: none;
  }

  .workspace {
    display: flex;
    flex: 1 0 auto;
    height: 100%;
    width: 100%;
  }

  .workspace-background {
    position: relative;
    background-color: rgba(0,0,0,0.5);
    width: calc(100vw - var(--plugins-size));
    transition: 0.5s ease-in width;
  }

  .workspace-canvas-container {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: 0.5s ease-in width;
  }

  .workspace-panels {
    width: var(--plugins-size);
    height: 100%;
    position: relative;
    transition: 0.5s ease-in width;
  }

  .workspace-tools {
    width: 4rem;
    text-align: center;
    /* border-top: 1rem solid var(--panel-layer-0); */
    border-right: 1px solid var(--panel-layer-0);
    border-radius: 2px;
    /* padding-top: 1rem; */
  }

  .workspace-tools:before {
    text-align: left;
    padding: 0 0.5rem;
    background-color: var(--panel-layer-0);
    content: "▶▶";
    font-size: 0.5rem;
    display: block;
    margin-bottom: 0.5rem;
    color: var(--muted-color);
  }

  .document-tabs {
    background-color:  var(--panel-layer-0);
  }

  .icon {
    transform: scale(0.75);
    opacity: 0.7;
    display: inline-block;
    position: relative;
    right: -1rem;
  }

  .icon:hover {
    opacity: 1;
  }
  
  .document-tabs ol {
    list-style: none;
    margin: 0 0;
    padding: 0 0;
    display: flex;
  }
  
  .document-tabs li {
    background-color:  var(--body-background-color);
    padding: 0.5rem 1.5rem 0.25rem 1rem;
    font-weight: 600;
    border: 1px solid var(--photoshop-border);
    border-bottom: none;
  }

  .document-tabs li:hover {
    background-color: var(--panel-layer-1);
  }

    .workspace-panels {
      background-color: var(--panel-layer-0);
      padding: 1rem 1rem;

    }

    .panel {
      align-items: center;
      background-color: var(--body-background-color);
      --c: var(--accent-color);
      padding-top: 0.5rem;
      border: 1px solid var(--photoshop-border);
      height: 90%;
      /* animation: 3s linear highlight alternate-reverse infinite; */
    }

    .panel-expander {
      color: var(--muted-color);
      position: absolute;
      left: -0.5rem;
      height: 5rem;
      top: calc(50% - 2.5rem);
      padding: 1rem 0rem;
    }

    .panel-title {
      background-color: var(--body-background-color);
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      display: inline-block;
      border: 1px solid var(--photoshop-border);
      border-bottom: none;
      position: relative;
      top: 1px; 
    }

    .panel-title:hover {
      background-color: var(--panel-layer-1);
    }


    @keyframes highlight {
  
      from {
        outline: 2px solid transparent;
        box-shadow: 0px 0px 10px transparent;
      }

      to {
        
        outline: 2px solid var(--c);
        box-shadow: 0px 0px 20px var(--c);
      }
    }
</style>