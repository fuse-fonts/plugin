
import { detectTheme, addListener } from "helpers/theme.js";
import { initializeMenu, initializeContextMenu, } from "helpers/menus.js";

detectTheme();
addListener();

import App from "App.html";

const appLoader = new App({
  target: document.querySelector("main#app"),
});

initializeMenu();
initializeContextMenu();