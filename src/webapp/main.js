import Photoshop from "Photoshop.html";
import { loadData } from "stores/typefaces.js";
import { loading, isPhotoshop } from "stores/app-settings.js";

isPhotoshop.set(false);

const target = document.getElementById("photoshop-emulation");
new Photoshop({ target, });


const loadFromLocalStorage = false;
loadData(loadFromLocalStorage);
loading.set(false);