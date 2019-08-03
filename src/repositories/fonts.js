import tryParseJSON from "helpers/tryParseJSON.js";
import csInterface from "helpers/cs-interface.js";

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
    if (fonts === null) return reject();

    // cache for future lookups
    // saveToLocalStorage(result);

    resolve(fonts);
  }));
}

const file = "fonts service";
const logColor = "color: #bb0;";

/** Try to Load fonts from local storage, then from the file system
 * @returns {[Typeface]|null} Returns data, or null if there was a problem
 */
async function loadFonts() {
  console.log(`${file}: %cLoading fonts...`, logColor)
  let fonts = loadFromLocalStorage();

  if (fonts === null) {
    console.log(`${file}: %cLoading fonts from file system`, logColor)
    fonts = await loadFromFileSystem();
    console.log(`${file}: %cFonts loaded from file system`, logColor);
    console.group("font data")
    console.log(fonts)
    console.groupEnd("font data")
  }
  else {
    console.log(`${file}:%cFonts loaded from local storage`, logColor);
  }

  console.log(`${file}: %cFonts loaded.`, logColor)
  return fonts;
};


/** Font Service
 * 
 */
export default {
  save: (data) => saveToLocalStorage(data),
  load: () => loadFonts(),
  purge: () => purgeFromLocalStorage(),
}