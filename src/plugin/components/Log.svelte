<div class="log" class:expanded>
  <header>
    <h1>Log</h1>
    <div>
      <button on:click="{() => expanded = !expanded}">
        <Icon icon={expanded ? "minimize" : "maximize"} color="#fff" />
      </button>
      <button on:click="{() => displayLog.set(false)}">
        <Icon icon="close" color="#fff"  />
      </button>
    </div>
  </header>
  <ol class="entries" bind:this={list} >
    {#each $logStore as entry (entry)}
      <li>
        <div class="service">
          {entry.service ? entry.service : "app"}
        </div>
        <div class="message">
          {entry.message}
        </div>
        <div class="details"></div>
      </li>
    {/each}
  </ol>
</div>

<script>
  let list = null;
  let expanded = false;

  import Icon from "components/Icon.svelte";
  import { displayLog } from "stores/user-settings.js";
  import { logStore, levelName } from "helpers/logger.js";


  logStore.subscribe( values => {

    if (list) {
      window.setTimeout(() => {
        list.scroll({
          top: list.scrollHeight,
          behavior: 'smooth'
        });
      })
    }

  });
</script>

<style>
  .log {
    --log-color: var(--foreground-color);
    --log-background: var(--error-color);
    position: fixed;
    
    left: 0;
    right: 0;
    bottom: 4rem;
    height: 8vh;
    
    z-index: 9;
    color: var(--log-color);
    font-family: monospace;
    opacity: 1;
    transition: all 0.2s ease-out;
    
  }

    .expanded {
    height: 50vh;
    bottom: 0;
  }

  .log header {
    position: absolute;
    padding-left: 1rem;
    width: 100%;
    margin-top: 0rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--log-background);
    border-bottom: 1px solid rgba(255,255,255,0.2);
  }

  .log h1 {
    font-size: 1rem;
    margin: 0 0;
    padding: 0 0;
  }

  .entries {
    list-style: none;
    background-color: var(--log-background);
    height: 100%;
    overflow-y: scroll;
    margin: 0rem -1rem;
    padding: 2.5rem 1rem 2rem 1rem;
  }



  .entries li {
    display: flex;
    flex-flow: row wrap;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }

  .service {
    opacity: 0.5;
    padding-right: 1rem;
  }

  button:hover,
  button:active,
  button:focus {
    background-color: rgba(255,255,255,0.2);
  }

</style>