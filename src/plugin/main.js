
import FuseFontsPlugin from "FuseFontsPlugin.svelte";
import { detectTheme, addThemeChangeListener } from "helpers/theme.js";
import { initializeMenu, initializeContextMenu, } from "helpers/menus.js";

import { loadData } from "stores/typefaces.js";
import { loading } from "stores/app-settings.js";

detectTheme();
addThemeChangeListener();


new FuseFontsPlugin({
  target: document.querySelector("main#app"),
});


loadData()
  .then(() => loading.set(false));

initializeMenu();
initializeContextMenu();

