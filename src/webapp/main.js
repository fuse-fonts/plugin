import Photoshop from "Photoshop.html";
import { loadData } from "stores/typefaces.js";
import { loading } from "stores/app-settings.js";

const target = document.getElementById("photoshop-emulation");
new Photoshop({ target, });

loadData();
loading.set(false);