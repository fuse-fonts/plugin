import tryParseJSON from "helpers/tryParseJSON.js";
import TypeFaceLibrary from "../datatypes/typeface-library";
import fontService from "services/fonts.js";

const LOCALSTORAGE_TYPEFACES_KEY = "typefaces";

const file = "typeface service";
const logColor = "color: #6b9";

/**
 * @returns {object}
 */
const loadFromLocalStorage = () => {
  return tryParseJSON(localStorage.getItem(LOCALSTORAGE_TYPEFACES_KEY));
};

/**
 * 
 * @param {object} data 
 */
const saveToLocalStorage = (data) => {
  console.log(`${file}: %cSaving Typeface data`, logColor);
  localStorage.setItem(LOCALSTORAGE_TYPEFACES_KEY, JSON.stringify(data));
};


/**
 * 
 */
async function loadTypefaces() {

  console.log(`${file}: %cLoading typefaces...`, logColor);

  const typefaces = loadFromLocalStorage();
  let library = null;

  // if there was no data in local storage we fetch from the JSX
  if (typefaces === null) {
    const fonts = await fontService.load();
    console.log(`${file}: %cTypefaces loaded from font data`, logColor);
    library = TypeFaceLibrary.parseFonts(fonts);
  }
  else {
    console.log(`${file}: %cSkipping font service`, logColor);
    console.log(`${file}: %cTypefaces loaded from local storage`, logColor);
    library = new TypeFaceLibrary(typefaces);
  }

  console.log(`${file}: %cTypefaces Loaded ✔`, logColor);

  return library.data;
};



/** Typeface Service
 *  Exposes the `load` and `save` functions
 */
export default {
  
  load: () => loadTypefaces(),

  save: (data) => saveToLocalStorage(data),
  

}
