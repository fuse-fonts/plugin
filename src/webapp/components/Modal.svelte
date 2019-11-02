<script>
  import Icon from "components/Icon.svelte";
  import { createEventDispatcher } from "svelte"
  import { fly, fade } from "svelte/transition";

  export let title = "";
  export let actionText = "OK";
  export let animateIn = false;
  const dispatch = createEventDispatcher();


  function closeModal() {
    dispatch("close");
  }

</script>

<style>

  .background {
    --modal-bg: rgba(68,68,68, 0.75);
    background-color: var(--modal-bg);
    backdrop-filter: blur(4px) saturate(0);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    z-index: 1;
  }

  .fade {
    animation: 1s ease-out become-transparent;
  }

  .modal {
    z-index: 2;
    width: 100%;
    max-width: 40rem;
    margin: auto auto;
    background-color: var(--panel-layer-0);
    font-size: 1.5rem;
    min-height: 50rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 6px rgba(0,0,0,0.5);
  }

  .modal-header {
    display: flex;
    flex: 0 1 auto;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--panel-border);
    padding: 1rem 2rem;
    background-color: rgba(255,255,255,0.02);
  }

  .modal-header .modal-title {
    font-weight: 400;
    font-size: 1rem;
    margin: 0 0;
    text-transform: uppercase;
    font-weight: 600;
  }

  .modal-body {
    padding: 2rem 2rem;
    display: flex;
    flex: 1 0 auto;
    flex-flow: column nowrap;
    justify-content: space-between;
    height: 100%;
  }

  .modal-footer {
    border-top: var(--panel-border);
    margin-top: auto;
    text-align: center;
  }

  button {
    font-weight: 600;
    font-size: 1.5rem;
    background-color: var(--muted-accent-color);
    margin-left: auto;
    padding: 1rem 2rem;
    cursor: pointer;
    text-transform: uppercase;
  }

  button:hover {
    background-color: var(--accent-color);
  }

  @keyframes become-transparent {
    from {
      background-color: var(--panel-layer-1);
    }

    25% {
      background-color: var(--panel-layer-1);
    }

    to {
      background-color: var(--modal-bg);
    }
  }

</style>

<div class="background" class:fade={animateIn} out:fade={{ duration: 300, }}>
  <section class="modal" transition:fly={{ initial: true, y: 100, duration: 200, }}>
    <header class="modal-header">
      <h1 class="modal-title">{title}</h1>
      <Icon icon="close" on:click={closeModal} />
    </header>
    <main class="modal-body">
    <slot>
    </slot>
    <footer class="modal-footer">
      <button on:click={closeModal}>{actionText}</button>
    </footer>
    </main>
  </section>
</div>