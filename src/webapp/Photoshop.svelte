<script>
  import PhotoshopMenus from "components/PhotoshopMenus.svelte";
  import PhotoshopWorkspace from "components/PhotoshopWorkspace.svelte";
  import Modal from "components/Modal.svelte";
  
  let displayModal = true;
  let threshold = 750;
  let width = window.innerWidth;
  $: canDisplay = width >= threshold;

  function closeModal() {
    displayModal = false;
  }

  </script>

<svelte:window bind:innerWidth={width} />

{#if displayModal}
  <Modal title="Welcome" actionText="Start Demo" on:close={closeModal}>
    <div class="modal-content">
      <p>This page will let you demo the Fuse Fonts plugin, using fonts from <a href="https://fonts.google.com" target="_blank" rel="noopener">Google Web Fonts</a>. <br />Within Adobe Photoshop, Fuse Fonts will use the fonts on your computer.</p>
      <h3>About the Demo</h3>
      <p>For the best experience you should use this demo on a device that you would normally run Adobe Photoshop.</p>
      <p>This demo is primarily intended for <strong>a laptop or desktop computer</strong>, with a screen <strong>wider than {threshold}px</strong>. </p>
      <p>This demo uses modern browser features, thus requires a modern browser. Latest Google Chrome is suggested for the best experience.</p>
    </div>
  </Modal>
{/if}

{#if canDisplay}
  <main class="photoshop">
    <PhotoshopMenus />
    <PhotoshopWorkspace />
  </main>
{:else}
  <div class="small-screens">
    <h1>Demo unavailable for small screens</h1>
    <p >Your device's screen is to small to view this demo. Try again on a device with a width greater than {threshold}px.</p>
  </div>
{/if}

<style>

  .small-screens {
    font-size: 5vw;
    line-height: 2em;
    padding: 5vh 10vw;
  }

  h1 {
    font-weight: 400;
    color: var(--accent-color);
  }

  .photoshop {
    display: block;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  .modal-content > * {
    font-size: 1.5rem;
    line-height: 1.75em;
  }

  .modal-content h3 {
    margin-top: 4rem;
    font-size: 1em;
    text-transform: uppercase;
  }

  a {
    color: var(--accent-color);
  }

</style>