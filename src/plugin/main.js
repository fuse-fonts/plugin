
import FuseFontsPlugin from "FuseFontsPlugin.svelte";
import { detectTheme, addThemeChangeListener } from "helpers/theme.js";
import { initializeMenu, initializeContextMenu, } from "helpers/menus.js";

import { loadData } from "stores/typefaces.js";
import { loading, isPanelVisible, isPersistant } from "stores/app-settings.js";

detectTheme();
addThemeChangeListener();

loading.set(true);

new FuseFontsPlugin({
  target: document.querySelector("main#app"),
});

window.addEventListener('load', (event) => {
  
  loadData()
    .then(() => {

      isPersistant.set(true);
      
      // watch for panel visibility
      // this is important so that we don't end up up dividing screen height by zero
      isPanelVisible.subscribe( isVisible => loading.set(!isVisible));
    });
});

initializeMenu();
initializeContextMenu();

