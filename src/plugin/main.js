
import FuseFontsPlugin from "FuseFontsPlugin.svelte";
import { get } from "svelte/store";
import { detectTheme, addThemeChangeListener } from "helpers/theme.js";
import { initializeMenu, initializeContextMenu, } from "helpers/menus.js";

import { loadData } from "stores/typefaces.js";
import { loading, isPanelVisible, isPersistant, panelTitle, loadFromLocalStorage } from "stores/app-settings.js";
import csInterface from "helpers/cs-interface.js";

detectTheme();
addThemeChangeListener();

loading.set(true);

new FuseFontsPlugin({
  target: document.querySelector("main#app"),
});

window.addEventListener('load', (event) => {
  
  // if the user set themeselves to bypass local storage
  const useLocalStorage = get(loadFromLocalStorage);

  loadData(useLocalStorage)
    .then(() => {

      // set panel title via store
      panelTitle.subscribe(title => csInterface.setWindowTitle(title));

      // persistant is disabled until better understood
      // isPersistant.set(true);
      
      // watch for panel visibility
      // this is important so that we don't end up up dividing screen height by zero
      isPanelVisible.subscribe( isVisible => loading.set(!isVisible));
    }).catch( reason => {
      console.trace(reason);
    })
});

initializeMenu();
initializeContextMenu();

