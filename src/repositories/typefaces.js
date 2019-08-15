import tryParseJSON from "helpers/try-parse-json.js";
import TypefaceLibrary from "datatypes/typeface-library";
import fontRepository from "repositories/fonts.js";
import { info, warning } from "helpers/logger.js";

const LOCALSTORAGE_TYPEFACES_KEY = "typefaces";

const serviceName = "typeface service";


/**
 * @returns {object}
 */
const loadFromLocalStorage = () => {
  info("Loading from local storage", null, serviceName);
  return tryParseJSON(localStorage.getItem(LOCALSTORAGE_TYPEFACES_KEY));
};

/**
 * 
 * @param {TypefaceLibrary} data 
 */
const saveToLocalStorage = (data) => {
  info("Saving to local storage", data, serviceName);
  localStorage.setItem(LOCALSTORAGE_TYPEFACES_KEY, JSON.stringify(data));
};

const clearLocalStorage = () => {
  info("Clearing Local Storage", null, serviceName);
  localStorage.removeItem(LOCALSTORAGE_TYPEFACES_KEY);
}


/**
 * 
 */
 function loadTypefaces() {
  return new Promise((resolve, reject) => {
    info("Loading...", null, serviceName);
  
    const typefaces = loadFromLocalStorage();
    let library = null;
  
    // if there was no data in local storage we fetch from the JSX
    if (typefaces === null) {
      warning("Typefaces not in local storage", null, serviceName);
      fontRepository.load()
        .then(fonts => {
          console.log(typeof fonts);
          info("Loaded from font data", fonts, serviceName);
          library = TypefaceLibrary.parseFonts(fonts);
          resolve(library);
        });
    }
    else {
      info("Loaded typefaces from local storage", typefaces, serviceName);
      library = new TypefaceLibrary(typefaces);
      info("Loaded.", null, serviceName);
      resolve(library);
    }
  })
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
