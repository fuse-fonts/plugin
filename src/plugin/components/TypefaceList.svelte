<script context="module">
/** 
 * Feature: Keep track of the amount the user has scrolled within specific groups and restore it when re-visiting.
 * See Also: onAfterUpdate callback below
 */
  import { debounce } from "helpers/utils.js";

  const scrollPositions = {};

  const captureScrollPosition = debounce((event, group) => {
    if (group) {
      const { scrollTop } = event.target;
      scrollPositions[group.ID] = scrollTop;
    }
  }, 60, false);

  
</script>

{#if hasGroupSelected}
  <section class="selected-group">
    <header class="group-header">
      <h2 class="group-name" title="Contains {typefaces.length} fonts">
        <span class="name">{title}</span>
        <div class="group-count">
          {typefaces.length} {isFiltering ? `of ${list.length}` : ""}
        </div>
      </h2>
      <section class="filter">
        {#if $fontPreviewAvailable}
          <SettingButton 
            text="Preview Font"
            toggles={true}
            enabled={$settings.previewFont} 
            on:click={toggleFontPreview} 
            title={$fontPreviewAvailable ? "Show font previews" : "Show font previews. Not available for small screen widths." }
          />
        {/if}
        <TypefaceFilter on:filter={(e) => filter(e.detail)} bind:value={filterText} />
      </section>
    </header>
    
    <ol class="typefaces" bind:this={typefaceList} on:scroll={(event) => captureScrollPosition(event, $selectedGroup)}>
      {#each typefaces as typeface, i (typeface)}
      <li>
          <TypeFace 
            {typeface} 
            {isLocked} 
            expanded={false} 
            selected={!!$selectedFonts[typeface.family]} 
            on:remove={removeTypeface}
          />
        </li>
      {:else}
        <li class="empty">
          {#if isFiltering}
            <div class="icon-section">
              <Icon disabled={true} color="var(--muted-color)" icon="not_listed_location" size="large" />
            </div>
            <h4 class="filter-text">{filterText}</h4>
            <p>...was not found within <b>{$selectedGroup.name}</b></p>
            <button on:click={clearFilter}>Clear</button>
          {:else}
            <div class="icon-section">
              <Icon disabled={true} color="var(--muted-color)" icon="folder_open" size="large" />
            </div>
            <p class="empty-title icon-section"><b>{$selectedGroup.name}</b> is empty</p>
            <p>Drag and Drop fonts from another group to add them here.</p>
          {/if}
        </li>
      {/each}
    </ol>
    <div class="banner">
      <SelectedBanner />
    </div>
  </section>
{:else}
  <div class="empty">
    <div class="icon-section">
      <Icon disabled={true} color="var(--muted-color)" icon="not_interested" size="large" />
    </div>
    <p>No group is selected.</p>
  </div>
{/if}

<style>

  .selected-group {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
  }

  .empty {
    padding: 6vh 1rem;
    text-align: center;
    color: var(--muted-color);
  }

  .empty-title {
    color: var(--foreground-color);
  }

  .filter-text {
    font-size: 2rem;
    color: var(--error-color);
    font-weight: 800;
    width: 100%;
    padding: 0 2rem;
    line-height: 3rem;
    margin: 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-section {
    margin-bottom: 2rem;
  }

  .group-header {
    width: 100%;
    display: block;
    text-align: center;
    border-bottom: var(--panel-border);
    background-color: var(--panel-layer-2);
  }

  .filter {
      display: block;
      width: 100%;
  }

  .group-count {
    display: block;
  }
  
  .group-name {
      font-size: 1rem;
      font-weight: 600;
      padding: 1rem 0.5rem;
      margin: 0 0;

    }

    .typefaces {
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      padding-bottom: 10vh;
    }

    .typefaces li {
      display: block;
    }

    .group-count {
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: 400;
      letter-spacing: 0.5px;
      margin: 0 1rem;
      color: var(--muted-color);
      user-select: none;
    }

  @media (min-width: 20rem) {

    .group-header {
      display: flex;
      flex-flow: row nowrap;
      flex: 1 0 auto;
      justify-content: space-between;
      align-items: center;
    }

    .group-count {
      display: inline;
    }

    .filter {
      justify-self: flex-end;
      display: flex;
      max-width: 50vw;
      flex: 0 1 50%;
      align-items: center;
    }

    .name {
      max-width: 12rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

  }


</style>

<script>

  import SettingButton from "components/SettingButton.svelte";
  import SelectedBanner from "components/SelectedBanner.svelte";
  import TypeFace from "components/TypeFace.svelte";
  import TypefaceFilter from "components/TypefaceFilter.svelte";
  import Icon from "components/Icon.svelte";

  import { setContext, afterUpdate } from "svelte";
  import { removeTypefaceFromGroup, selected as selectedGroup } from "stores/custom-groups.js";
  import { selected as selectedFonts } from "stores/font-selection.js";

  import { settings } from "stores/user-settings.js";
  import { fontPreviewAvailable } from "stores/app-settings.js";

  /** Upon re-visiting a group already viewed, restore it's scroll positions
   * 
   */
  afterUpdate(() => {

    const group = $selectedGroup;
    if (group !== null && typefaceList !== null) {
      const { ID, name } = group;
      const scrollAmount = scrollPositions[ID];
      if (scrollAmount) {
        typefaceList.scrollTo(0, scrollAmount);
      }
      
    }
  })

  let hasGroupSelected = false;
  $: hasGroupSelected = $selectedGroup !== null;

  let isLocked = false; // if changes can happen to this group
  let typefaceList = null;
  let hasFilter = false;
  let isFiltering = false;
  let filterText = "";

  // based on currently selected group
  let typefaces = [];
  let list = [];
  let title = "";
  const maxTitleLength = 32;
  const ellipsis = "…";
  const selectedCount = 0;

  $: setContext("selectedGroup", $selectedGroup);

  selectedGroup.subscribe(value => {
    
    selectedFonts.clear();

    // reset all vars on empty
    if (value === null) {
      title = "";
      list = [];
      typefaces = [];
      isLocked = false;  
      return;
    }

    // update title
    if (value.name.length > maxTitleLength) {
      
      let t = value.name
        .split(" ")
        .reduce((p, c) => {
          if (p.done) return p;
          if (1 + p.text.length + c.length < maxTitleLength - 1) {
            p.text = `${p.text} ${c}`;
          }
          else {
            p.done = true;
          }
          return p;
        }, { text: "", done: false, })
        .text;

      if (t.length === 0) {
        t = value.name.substring(0, maxTitleLength - 1);
      }
      
      title = `${t}${ellipsis}`;
        
    }
    else {
      title = value.name;
    }

    // update locked state
    isLocked = value.permanent;

    // update items
    list = value.typefaces.toList();
    typefaces = list;

    // re-apply filter
    filter(filterText);
  });

  function filter(text) {

    filterText = text;
    isFiltering = filterText.length > 0;

    if (isFiltering) {
      
      typefaces = Array
        .from(list)
        .filter(typeface => typeface.family.toLowerCase().includes(filterText.toLowerCase()));
    }
    else {
      typefaces = list;
      filterText = "";
    }
  }

  function removeTypeface(e) {
    const typeface = e.detail;
    selectedGroup.update( value => {
      removeTypefaceFromGroup($selectedGroup, typeface);
      return value;
    })
  }

  function clearFilter() {
    return filter("");
  }

  function toggleFontPreview() {
    settings.toggleSetting("previewFont");
  }
</script>