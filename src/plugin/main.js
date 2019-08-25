
import FuseFontsPlugin from "FuseFontsPlugin.html";
import { detectTheme, addListener } from "helpers/theme.js";
import { initializeMenu, initializeContextMenu, } from "helpers/menus.js";

import { loadData } from "stores/typefaces.js";
import { loading } from "stores/app-settings.js";

detectTheme();
addListener();


new FuseFontsPlugin({
  target: document.querySelector("main#app"),
});


loadData();

initializeMenu();
initializeContextMenu();

loading.set(false);
