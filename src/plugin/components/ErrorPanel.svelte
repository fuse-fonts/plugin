<script>
    import { onMount } from "svelte";
    import Collapsible from "components/Collapsible.svelte";
    import Icon from "components/Icon.svelte";
    import csInterface from "helpers/cs-interface.js";
    import { hasRuntimeError, runTimeError, errorLogFiles, createErrorText } from "stores/error-service.js";
    import fileSystem from "repositories/file-system.js";
    import { settingsOpened, displayLog } from "stores/user-settings.js";


    function openLog(path) {
        let result = csInterface.openURLInDefaultBrowser(path);
        if (result.err !== 0) {
            alert(`Unable to open this file in default browser.\n${path}`);
        }
    }

    function openSettings() {
        settingsOpened.set(true);
    }

    function toggleLog() {
        displayLog.update( v => !v);
    }

    function reloadApp() {
        window.location.reload();
    }

</script>

<style>
    .error-pane {
        
        --color: var(--foreground-color);
        --background: var(--error-color);


        padding: 2rem 2rem;
        max-height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
    }

    header {
        display: flex;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: var(--border);
        margin-bottom: 1rem;
    }

    .error-icon {
        padding: 1rem 1rem;
        text-align: center;
    }

    .error {
        color: var(--color);
        background-color: var(--background);
        border-radius: 6px;
    }

    h1, h2 {
        font-size: 2rem;
        line-height: 1.5em;
        font-weight: 200;
        margin: 0 0 1rem 0;
    }

    h2 {
        margin-top: 2rem;
    }

    h3 {
        font-size: 1rem;
        margin: 0 0;
        margin-top: 2rem;
    }

    .error .stack,
    .error .data {
        font-family: monospace;
        word-break: break-all;
    }

    section {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        background-color: rgba(0,0,0, 0.10);
    }

    .log-item button {
        margin-bottom: 0.5rem;
        padding: 0.5rem 0.5rem;
        text-align: left;
        display: block;
    }

    button {
        border-bottom: 1px solid var(--accent-color);
    }

    .log-item code {
        word-break: break-all;
        margin-left: 0.5rem;
    }



</style>


<div class="error-pane">
    <header>
        <div class="error-icon">
            <Icon icon="report_problem" color="var(--error-color)" size="large" blink={true} />
        </div>
        <h1>Fuse Fonts Unexpected Error</h1>
    </header>

    <p>Log files were generated from this error. <br /> If you repeatedly see this screen, you may need to contact support with these log files.</p>

    <h2>Caught Error</h2>
    <div class="error">
        <Collapsible title={$runTimeError.message} padded={false}>

            <Collapsible title="Stack Trace" collapsed={false}>
                <p class="stack">{$runTimeError.stack}</p>
            </Collapsible>

            <Collapsible title="Data">
                <p class="data">
                    {#if typeof $runTimeError.data === "string"}
                        {$runTimeError.data}
                    {:else}
                        {JSON.stringify($runTimeError.data)}
                    {/if}
                </p>
            </Collapsible>

        </Collapsible>
    </div>

    <h2>Actions</h2>
    <section>
        <p>
            <button class="primary" on:click={reloadApp}>Reload Fuse Fonts</button>
            <button on:click={openSettings}>Open Settings</button>
            <button on:click={toggleLog}>Toggle Logging</button>
        </p>
    </section>

    <h2>Logs</h2>
    <section>
        <p>Logs are saved to <br /> <code>{fileSystem.backupDirectory}/</code></p>
        <p>The logs listed below are only from this instance of Fuse Fonts.</p>
        {#each $errorLogFiles as logPath}
            <div class="log-item">
                <button on:click={() => openLog(logPath)}>Open <code>{logPath.split(fileSystem.backupDirectory)[1]}</code></button>
            </div>
        {:else}
            <p>No log files.</p>
        {/each}

        <h3>Most Recent Log File</h3>

        <Collapsible title="View">
            <pre><code>{createErrorText($runTimeError)}</code></pre>
        </Collapsible>
    </section>

    <h2>Contacting Support</h2>
    <section>
        <p>
            To contact support, email <code>support@fusefonts.com</code>.
        </p>
        <p>
            {#each $errorLogFiles as logPath, i}
                {#if i <= 1}
                    <div class="log-item">
                        <button on:click={() => openLog(logPath)}>Please attach this log file in your email</button>
                    </div>
                {/if}
            {/each}
        </p>
        <p>Note that logs are only used for diagnostics. The logs are not shared with anyone outside of Fuse Fonts. They may have small amount of personally identifiable information in the form of file paths on your computer and the fonts that are installed on your computer.</p>
    </section>
</div>
