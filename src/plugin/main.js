
import FuseFontsPlugin from "FuseFontsPlugin.svelte";
import { detectTheme, addThemeChangeListener } from "helpers/theme.js";
import { initializeMenu, initializeContextMenu, } from "helpers/menus.js";

import { loadData } from "stores/typefaces.js";
import { loading, isPanelVisible, isPersistant, panelTitle } from "stores/app-settings.js";
import csInterface from "helpers/cs-interface.js";

detectTheme();
addThemeChangeListener();

loading.set(true);

new FuseFontsPlugin({
  target: document.querySelector("main#app"),
});

window.addEventListener('load', (event) => {
  
  loadData()
    .then(() => {

      // set panel title via store
      panelTitle.subscribe(title => csInterface.setWindowTitle(title));

      // persistant is disabled until better understood
      // isPersistant.set(true);
      
      // watch for panel visibility
      // this is important so that we don't end up up dividing screen height by zero
      isPanelVisible.subscribe( isVisible => loading.set(!isVisible));
    });
});

initializeMenu();
initializeContextMenu();

