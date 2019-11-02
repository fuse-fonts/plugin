import FuseFontsPlugin from "FuseFontsPlugin.svelte";
import { loadData } from "stores/typefaces.js";
import { loading, isPhotoshop, outputLogToConsole } from "stores/app-settings.js";
import { addPostMessageListener } from "helpers/theme.js";

outputLogToConsole.set(false);
isPhotoshop.set(false);
addPostMessageListener();

const target = document.getElementById("plugin");
new FuseFontsPlugin({ target, });

const loadFromLocalStorage = false;
loadData(loadFromLocalStorage)
  .then(() => loading.set(false));

