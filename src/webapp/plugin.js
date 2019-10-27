import FuseFontsPlugin from "FuseFontsPlugin.svelte";
import { loadData } from "stores/typefaces.js";
import { loading, isPhotoshop, outputLogToConsole } from "stores/app-settings.js";

outputLogToConsole.set(false);
isPhotoshop.set(false);

const target = document.getElementById("plugin");
new FuseFontsPlugin({ target, });

const loadFromLocalStorage = false;
loadData(loadFromLocalStorage);
loading.set(false);

