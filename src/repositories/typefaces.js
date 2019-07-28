import tryParseJSON from "helpers/tryParseJSON.js";
import TypefaceLibrary from "datatypes/typeface-library";
import fontRepository from "repositories/fonts.js";

const LOCALSTORAGE_TYPEFACES_KEY = "typefaces";

const file = "typeface service";
const logColor = "color: #69b";

/**
 * @returns {object}
 */
const loadFromLocalStorage = () => {
  return tryParseJSON(localStorage.getItem(LOCALSTORAGE_TYPEFACES_KEY));
};

/**
 * 
 * @param {TypefaceLibrary} data 
 */
const saveToLocalStorage = (data) => {
  console.log(`${file}: %cSaving Typeface data`, logColor);
  localStorage.setItem(LOCALSTORAGE_TYPEFACES_KEY, JSON.stringify(data));
};

const clearLocalStorage = () => {
  localStorage.removeItem(LOCALSTORAGE_TYPEFACES_KEY);
}


/**
 * 
 */
async function loadTypefaces() {

  console.log(`${file}: %cLoading typefaces...`, logColor);

  const typefaces = loadFromLocalStorage();
  let library = null;

  // if there was no data in local storage we fetch from the JSX
  if (typefaces === null) {
    const fonts = await fontRepository.load();
    console.log(`${file}: %cTypefaces loaded from font data`, logColor);
    library = TypefaceLibrary.parseFonts(fonts);
  }
  else {
    console.log(`${file}: %cSkipping font service`, logColor);
    console.log(`${file}: %cTypefaces loaded from local storage`, logColor);
    library = new TypefaceLibrary(typefaces);
  }

  console.log(`${file}: %cTypefaces Loaded ✔`, logColor);

  return library;
};



/** Typeface Repository
 *  Exposes the `load` and `save` functions
 */
export default {
  
  load: () => loadTypefaces(),

  save: (typefacelibrary) => saveToLocalStorage(typefacelibrary.data),
  
  clear: () => {
    clearLocalStorage();
  }
}
