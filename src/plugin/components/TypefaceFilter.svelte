<div class="typeface-filter" >
  <input 
    {maxlength}
    type="text" 
    bind:value={value} 
    placeholder="Filter" 
    class:has-value={hasValue} 
    bind:this={input} 
    on:input={debouncedChange} 
  />

  <div class="icon-overlay">
    <Icon icon={hasValue ? "close" : "search"} color="var(--muted-color)" hover="var(--foreground-color)" on:click={clearFilter} />
  </div>
</div>

<script>

  import { createEventDispatcher } from 'svelte';
  import Icon from "components/Icon.svelte";
  import { debounce } from "helpers/utils.js";

  const dispatch = createEventDispatcher();

  export let maxlength = 40;
  export let value = "";
  let input;

  $: hasValue = value.length > 0;

  function clearFilter(e) {
    value = "";
    input.focus();
    dispatch("filter", cleanResult(value));
  }


  const debounceTime = 120;
  const debouncedChange = debounce(changed, debounceTime, false);

  function changed(e) {
    dispatch("filter", cleanResult(value));
  }

  function cleanResult(text) {
    const trimmed = text.trim();
    return trimmed;
  }
</script>


<style>
  .typeface-filter {
    
    --filter-color: var(--panel-layer-3);

    padding: 0.5rem 0.5rem;
    position: relative;
    width: 100%;
    max-width: 20rem;
    margin: 0 auto;
  }

  @media (min-width: 20rem) {
    .typeface-filter {
      margin-right: 0;
    }
  }

  .icon-overlay {
    position: absolute;
    right: 1rem;
    top: 0.85rem;
    cursor: pointer;
  }

  input {
    font-size: 1rem;
    display: inline-block;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.5rem 0.5rem;
    color: var(--foreground-color);
    font-weight: 600;
    font-family: "Tahoma", sans-serif;
    border-radius: 3px;
    width: 100%;
    background-color: rgba(255,255,255,0.1);
  }

  .has-value {
    background-color: var(--filter-color);
  }

  input::placeholder {
    font-weight: 400;
    color: var(--muted-color);
    
    padding-right: 2rem;
  }

  
  input:focus {
    box-shadow: none;
    outline: none;
    background-color: var(--filter-color);
    color: var(--foreground-color);
  }

  input::selection {
    background-color:var(--accent-color);
    color: var(--foreground-color);
  }

</style>