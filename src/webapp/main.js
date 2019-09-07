import Photoshop from "Photoshop.html";
import { loadData } from "stores/typefaces.js";
import { loading, isPhotoshop, outputLogToConsole } from "stores/app-settings.js";

outputLogToConsole.set(false);
isPhotoshop.set(false);

const target = document.getElementById("photoshop-emulation");
new Photoshop({ target, });

const loadFromLocalStorage = false;
loadData(loadFromLocalStorage);
loading.set(false);

