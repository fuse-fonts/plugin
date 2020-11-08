<script>
  import { allTests } from "tests/tests.js";
  import { onMount } from "svelte";
  import Icon from "components/Icon.svelte";
  import { outputLogToConsole } from "stores/app-settings.js";

  async function run() {
    isRunning = true;
    outputLogToConsole.set(false);
    console.group("Performing Tests");
    const completed = allTests.reduce((chain, test) => {

      const nextSequence = chain
        .then(() => test.run() || Promise.resolve())
        .catch((err) => {
          results[test.label] = Promise.reject(err);
          return Promise.resolve();
        })

      results[test.label] = nextSequence;
      return nextSequence;

    }, Promise.resolve());

    await completed;
    isRunning = false;
    console.groupEnd("Performing Tests");
    outputLogToConsole.set(true);
  }

  let isRunning = false;

  const results = {};

  // group by the test
  const groupedItems = allTests.reduce((map, test) => {
    let group = {
      label: test.group
        .toString()
        .replace("Symbol(", "")
        .replace(")", ""),
      items: []
    };

    if (map.has(test.group)) {
      group = map.get(test.group);
    }

    group.items.push(test);

    map.set(test.group, group);
    return map;
  }, new Map());

  const tests = [...groupedItems.values()];

  let result = null;
  const view = r => result = r;
  const disabled = true;

  onMount(() => run());

</script>

<style>


  button[disabled] {
    background: var(--panel-layer-0);
  }

  h2 {
    font-weight: 200;
  }

  table {
    margin-bottom: 2rem;
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

  tr td {
    width: 33%;
  }

  .running {
    color: var(--muted-color);
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

  .suite h4 {
    margin-top: 2rem;
  }

  .result-view {
    padding: 0.5rem 1rem;
    background: var(--panel-layer-0);
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>

<button on:click={run} disabled={isRunning}>
  {isRunning ? "Running..." : "Run Tests"}
</button>

{#each tests as testGroup}
  <h2>{testGroup.label}</h2>
  <table>
    <thead>
      <tr>
        <th scope="test">Test</th>
        <th scope="status">Status</th>
        <th scope="result">Result</th>
      </tr>
    </thead>
    <tbody>
      {#each testGroup.items as testRun}
        <tr>
          <td>{testRun.label}</td>
          {#if results[testRun.label]}
            {#await results[testRun.label]}
              <td class:running={true}>Running...</td>
              <td> 
                <button {disabled}>View</button>
                </td>
            {:then result}
              <td class:passed={true}> <Icon icon="done" /> Passed</td>
              <td> 
                <button on:click={() => view(result)}>View</button>
              </td>
            {:catch result}
              <td class:failed={true}><Icon icon="report_problem" />  Failed</td>
              <td> 
                <button on:click={() => view(result)}>View</button>
              </td>
            {/await}
          {:else}
            <td>Ready</td>
            <td class:muted={true}>—</td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
{/each}

{#if result !== null}
  <div class="result-view">
      <code>{result}</code>
      <button on:click={() => view(null)}>
        <Icon icon="close" />
      </button>
  </div>
{/if}
