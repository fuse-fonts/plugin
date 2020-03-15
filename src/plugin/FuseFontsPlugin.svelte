<div>

  {#if $loading}
    <Loading text="Loading Fonts..." color="#fff" />
  {:else if $settingsOpened}
    <Settings />
  {:else}
      
      <DragRegion>
        <ResizablePane split={$settings.panelSplit}>
          <div slot="top" class="full-height">
            <Panel>
              <CustomGroupsList />
            </Panel>
          </div>
          
          <div slot="bottom" class="full-height">
            <Panel>
              <TypefaceList />
            </Panel>
          </div>
          
        </ResizablePane>
      </DragRegion>

  {/if}

  {#if $displayLog}
    <Log />
  {/if}
</div>

<style>

  .full-height {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
  }
</style>

<script>

  // sub components
  import Loading from "components/Loading.svelte"
  import Log from "components/Log.svelte"
  import Settings from "components/Settings.svelte";
  import ResizablePane from "components/ResizablePane.svelte";
  import DragRegion from "components/DragRegion.svelte";
  import CustomGroupsList from "components/CustomGroupsList.svelte";
  import TypefaceList from "components/TypefaceList.svelte";
  import Panel from "components/Panel.svelte";

  

  // stores
  import { loading, panelTitle } from "stores/app-settings.js";
  import { settings, settingsOpened, displayLog } from "stores/user-settings.js";

  

</script>