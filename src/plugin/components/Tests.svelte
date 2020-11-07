<script>
  import { allTests } from "tests/tests.js";
  import { onMount } from "svelte";

  async function run() {
    isRunning = true;
    const completed = allTests.map(test => results[test.label] = test.run() || Promise.resolve());

    await Promise.all(completed)
    isRunning = false;
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

  onMount(() => run());
</script>

<style>
  button {
    background: var(--accent-color);
  }

  button[disabled] {
    background: var(--panel-color-0);
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
    width: 33%;
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

  .suite h4 {
    margin-top: 2rem;
  }
</style>

<button on:click={run} disabled={isRunning}>
  {isRunning ? "Running..." : "Run Tests"}
</button>

{#each tests as testGroup}
  <h3>{testGroup.label}</h3>
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
              <td>—</td>
            {:then result}
              <td class:passed={true}>Passed</td>
              <td>{result}</td>
            {:catch result}
              <td class:failed={true}>Failed</td>
              <td>{result}</td>
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
