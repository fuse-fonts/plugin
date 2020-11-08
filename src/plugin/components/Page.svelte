<script>
    
    import Icon from "components/Icon.svelte";

    import { createEventDispatcher } from "svelte";
    export let page = true;
    export let title = "Page";
    export let error = false;

    const dispatch = createEventDispatcher();
</script>
<style>
    .page {
        padding: 2rem 2rem;
        padding-top: 8rem;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: var(--panel-layer-1);
        min-height: 100vh;
    }

    .page-header {
        background-color: var(--panel-layer-1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 0rem 2rem;
        border-bottom: 1px solid var(--panel-border-color);
        margin-bottom: 1rem;
    }

    .error {
        background-color: var(--error-color);
    }
</style>


<article>
    <header class="page-header" class:error>
        <h1>{title}</h1>
        {#if !error}
            <button on:click={() => dispatch("close")}>
                <Icon icon="close" />
            </button>
        {/if}
    </header>
    <div class:page>
        <slot />
    </div>
</article>