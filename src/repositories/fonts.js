import tryParseJSON from "helpers/try-parse-json.js";
import csInterface from "helpers/cs-interface.js";
import { info, warning, error } from "helpers/logger.js";

const GET_FONT_LIST_JSX = "getFontList()";
const LOCALSTORAGE_FONTS = "fonts";

// "cache" mechanisms
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_FONTS));
const saveToLocalStorage = (result) => localStorage.setItem(LOCALSTORAGE_FONTS, result);
const purgeFromLocalStorage = () => localStorage.removeItem(LOCALSTORAGE_FONTS);

/** Loads the fonts using our host JSX function
 * @returns {Promise} Returns a promise that resolves to a Typefaces list, 
 *                    or rejects if it failed to retrieve data.
 */
const loadFromFileSystem = () => {
  return new Promise((resolve, reject) => csInterface.evalScript(GET_FONT_LIST_JSX, (result) => {
    const fonts = tryParseJSON(result);
    if (fonts === null ) return reject();

    // cache for future lookups
    // saveToLocalStorage(result);

    resolve(fonts);
  }));
}

const serviceName = "fonts service";

/** Try to Load fonts from local storage, then from the file system
 * @returns {[Typeface]|null} Returns data, or null if there was a problem
 */
function loadFonts() {

  return new Promise((resolve, reject) => {

    info("Loading", null, serviceName);
    
    let fonts = loadFromLocalStorage();
  
    if (fonts === null) {
      warning("Fonts not in local storage", null, serviceName);
      info("Loading fonts from file system", null, serviceName);
      return loadFromFileSystem().then((fonts) => {
        info("fonts loaded from file system", fonts, serviceName);
        info("Loaded.", fonts, serviceName);
        resolve(fonts);
      });
    }
    else {
      info("fonts loaded from local storage", fonts, serviceName);
      resolve(fonts);
    }
  });
};


/** Font Service
 * 
 */
export default {
  save: (data) => saveToLocalStorage(data),
  load: () => loadFonts(),
  purge: () => purgeFromLocalStorage(),
}