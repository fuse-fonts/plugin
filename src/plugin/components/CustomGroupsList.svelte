<div class="custom-groups">
  <ul class:custom-groups-list={listView} class:custom-groups-tiles={!listView}>
    <li class="fixed">
      <CustomGroup group={$allFontsGroup} selected={$selected===$allFontsGroup} on:select={selectGroup} />
    </li>
    
    {#each $customGroups as group, i (group.ID)}
      <li>
        <CustomGroup tiled={!listView} {group} selected={$selected === group} editing={group.isNew} on:select={selectGroup} on:dropped={addSelectionToGroup} />
      </li>
      {/each}
    </ul>
    {#if $customGroups.length === 0}
    <section class="empty">
      <p>No Custom Groups</p>
      <p>
        <button class="create-group" on:click={createGroup}>
          <i><Icon icon="folder" /></i> Create Your First Group
        </button>
      </p>
    </section>
    {/if}

  <div class="custom-groups-actions">
    <ActionsPanel bind:listView={listView} />
  </div>
</div>

<style>
  .custom-groups {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }
  
  .custom-groups-list {
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0rem 0rem;
  }

  .custom-groups-list li {
    display: block;
    border-bottom: var(--panel-border);
  }

  .custom-groups-actions {
    background-color: var(--panel-layer-2);
  }

  .custom-groups .empty {
    padding: 0rem 1rem;
    text-align: center;
    color: var(--muted-color);
    border-bottom: none;
  }

  .custom-groups .empty p {
    margin: 0 0 1rem 0;
  }

  button i {
    display: inline-block;
    margin-right: 0.5rem;
  }

  .custom-groups-tiles {
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0.5rem 0rem 0.5rem 0rem;
    display: flex;
    width: 100%;
    flex: 0 1 auto;
    flex-direction: row;
    list-style: none;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;
  }

  .custom-groups-tiles li {
    width: 100%;
    max-width: 10rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 3px;
    background-color: var(--panel-layer-1);
    margin: 0.5rem 0.5rem;
    
  }

  .custom-groups-tiles li:first-of-type {
    width: 100%;
  }

  button.create-group {
    padding: 0.5rem 1rem;
    background-color: var(--accent-color);
    box-shadow: 0px 0px 40px var(--accent-color);
    animation: 0.5s glow linear alternate-reverse infinite;
    transition: 0.5s all ease-in;
  }
  
  button.create-group:hover {
    box-shadow: 0px 0px 0px var(--accent-color);

  }

  @keyframes glow {
    from {
      box-shadow: 0px 0px 40px var(--accent-color);
    }

    to {
      box-shadow: 0px 0px 80px var(--accent-color);
    }
  }

</style>

<script>

  import { fly } from 'svelte/transition';

  import Icon from "components/Icon.svelte";
  import ActionsPanel from "components/ActionsPanel.svelte";
  import CustomGroup from "components/CustomGroup.svelte";

  import { settings } from "stores/user-settings.js";
  import { selected, customGroups, allFontsGroup, createGroup } from "stores/custom-groups.js";
  import { selected as selectedFonts } from "stores/font-selection.js";

  let listView = true;

  settings.subscribe(values => {
    listView = values.listView;
  })

  function selectGroup(e) {
    selected.set(e.detail);
  }

  function addSelectionToGroup(e) {
    const groupID = e.detail;
    const group = $customGroups.find(group => group.ID === groupID);
    
    if (group) {
      customGroups.update(groups => {
        const typefaces = selectedFonts.get();
        group.typefaces.merge(typefaces);
        return groups;
      });
    }
  }

</script>