<script>
    import { allTests } from "tests/tests.js";

    function run() {
        console.log(allTests);
        allTests.forEach( test => {
            results[test.test] = test.run();
        });
    }

    const results = {};

</script>

<style>

    button {
        background: var(--accent-color);
    }

    table {
        margin: 1rem 0;
        font-size: 1.2em;
        width: 100%;
        border: var(--panel-border);
        border-collapse: collapse;
    }

    thead th {
        padding: 0.5rem 0.5rem;
        background: var(--panel-layer-2);
        font-weight: 600;
        text-align: left;
    }

    tr {
        border-bottom: var(--panel-border);
    }

    td {
        padding: 0.5rem 0.5rem;
        border: var(--panel-border);
    }

    tr > td {
        width: 33%
    }

    .running {
        color: var(--accent-color);
    }

    .passed {
        color: var(--success-color);
    }

    .failed {
        color: var(--error-color);
    }

    .muted {
        opacity: 0.5;
    }

    .empty {
        text-align: center;
        color: var(--muted);
    }
</style>

<button on:click={run}>Run Tests</button>


<table>
    <thead>
        <tr>
            <th scope="test">Test</th>
            <th scope="status">Status</th>
            <th scope="result">Result</th>
        </tr>
    </thead>
    <tbody>
        {#each allTests as testRun}
            <tr>
                <td>{testRun.test}</td>
                {#if results[testRun.test]}
                    {#await results[testRun.test]}
                        <td class:running={true}>Running...</td>
                        <td>—</td>
                    {:then result}
                        <td class:passed={true}>Passed</td>
                        <td>{result}</td>
                    {:catch result}
                        <td class:failed={true}>Failed</td>
                        <td>{result}</td>
                    {/await}
                {:else}
                    <td>
                        Ready
                    </td>
                    <td class:muted={true}>—</td>
                {/if}
            </tr>
        {:else}
            <tr>
                <td colspan="3" class="empty muted">
                    <p>No tests to run</p>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
