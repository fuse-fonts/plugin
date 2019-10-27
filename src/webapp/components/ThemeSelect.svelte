<script>
  import { THEME, theme } from "helpers/theme.js";
  
  const themes = Object.keys(THEME);

  let currentTheme = themes[0];

  function toTitleCase(word) {
    if (word.length <= 1) return word.toUpperCase();;
    var upper = word[0].toUpperCase();
    var lower = word.substring(1).toLowerCase();
    return `${upper}${lower}`;
  }

  function changeTheme(event) {
    const value = THEME[currentTheme];
    const pluginFrame = window.frames[0] || null;

    theme.set(value);

    if (pluginFrame) {
      pluginFrame.postMessage(THEME[currentTheme], "*")
      ;
    }

  }

</script>

<label class="theme-select-container">
  <span class="label-text">Photoshop Theme</span>
  <select class="theme-select" bind:value={currentTheme} on:change={changeTheme}>
    {#each themes as themeName}
      <option value={themeName}>{toTitleCase(themeName)}</option>
    {/each}
  </select>

</label>


<style>

  .theme-select-container {
    margin: 2rem 0 0 0;
    padding: 0.5rem 1rem;
    background-color: var(--panel-layer-0);
    display: flex;
    flex: 1 0 50%;
    align-items: center;
    justify-content: center;
  }

  .label-text {
    display: block;
    font-size: 1rem;
    font-weight: 600;
  }

  .theme-select {
    font-size: 1.5rem;
    padding: 0.5rem 0.5rem;
    margin-left: 2rem;
    background-color: var(--panel-layer-1);
    color: var(--body-color);
    border: var(--panel-border);
    min-width: 10rem;
  }

</style>