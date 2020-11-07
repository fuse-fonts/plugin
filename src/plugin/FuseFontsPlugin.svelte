<div>
  
  {#if $hasRuntimeError}
    <Page title={`${pluginName} has encountered an error`} error={true}>
      <ErrorPanel />
    </Page>
  {:else if $showTests}
      <Page title="Tests" on:close={closeTestsPage}>
        <Tests />
      </Page>
  {:else if $settingsOpened}
    <Page title="Settings" on:close={closeSettingsPage}>
      <Settings />
    </Page>
  {:else if $loading}
    <Loading text="Loading Fonts..." color="#fff" />
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
  import ErrorPanel from "components/ErrorPanel.svelte";
  import Tests from "components/Tests.svelte";
  import Page from "components/Page.svelte";

  // stores
  import { loading, panelTitle, showTests, settingsOpened, displayLog, pluginName } from "stores/app-settings.js";
  import { settings, } from "stores/user-settings.js";
  import { hasRuntimeError, hideRuntimeError } from "stores/error-service.js";

  function closeTestsPage() {
    hideRuntimeError.set(false);
    showTests.set(false);
  }

  function closeSettingsPage() {
    hideRuntimeError.set(false);
    settingsOpened.set(false);
  }
</script>