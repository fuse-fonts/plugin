<script>
    import { slide } from "svelte/transition";
    export let collapsed = true;
    export let title = "";
    export let padded = true;

    $: icon = collapsed ? "expand_more" : "expand_less";
    import Icon from "components/Icon.svelte";


    function toggle() {
        collapsed = !collapsed;
    }
</script>

<style>

    .collapsible {
        margin-bottom: 1rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        padding: 0.5rem 1rem;
        cursor: pointer;
        background-color: rgba(0,0,0,0.1);
    }


    header:hover {
        background-color: rgba(0,0,0,0);
    }

    .collapsible-content {

    }

    .padded {
        padding: 1rem 1rem;
    }


</style>

<div class="collapsible">
    <header on:click={toggle}>
        {title}
        <Icon {icon} />
    </header>
    {#if !collapsed}
        <section transition:slide|local class="collapsible-content" class:padded>
            <slot />
        </section>
    {/if}
</div>

