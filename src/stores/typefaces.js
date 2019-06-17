import { writable, get } from "svelte/store";
import fontsStore from "stores/fontsjs";
import tryParseJSON from "helpers/tryParseJSON.js";
import TypeFaceLibrary from "../datatypes/typeface-library";


const LOCALSTORAGE_TYPEFACES_KEY = "typefaces";

const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_TYPEFACES_KEY));
const saveToLocalStorage = (typefaces) => {
  let data = JSON.stringify(typefaces.toString());
  localStorage.setItem(LOCALSTORAGE_TYPEFACES_KEY, data);
};




/**
 * 
 */
function loadTypefaces() {
  
  let typefaces = loadFromLocalStorage();
  let library = null;
  
  // if there was no data in local storage we fetch from the JSX
  if (typefaces === null) {
    const fontsJSON = get(fontsStore);
    library = TypeFaceLibrary.parseFonts(fontsJSON);
  }
  else {
    library = new TypeFaceLibrary(typefaces);
  }

  saveToLocalStorage(library);

  return library;
}

// our typeface store
// exported further below
const typefacesStore = writeable({ typefaces: loadTypefaces(), });

// any changes we then save to local storage
typefacesStore.subscribe(library => saveToLocalStorage(library));

export default typefacesStore;