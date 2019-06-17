import { readable } from "svelte/store";
import tryParseJSON from "helpers/tryParseJSON.js";


const csInterface = window.csInterface;
const GET_FONT_LIST_JSX = "getFontList()";

const LOCALSTORAGE_FONTS = "fonts";

// "cache" mechanisms
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_FONTS));
const saveToLocalStorage = (result) => localStorage.setItem(LOCALSTORAGE_FONTS, result);


/** Loads the fonts using our JSX function
 * @returns {Promise} Returns a promise that resolves to a Typefaces list, 
 *                    or rejects if it failed to retrieve data.
 */
const loadFromFileSystem = () => {
  return new Promise((resolve, reject) => csInterface.evalScript(GET_FONT_LIST_JSX, (result) => {
    const fonts = tryParseJSON(result);
    if (fonts === null) return reject();

    // cache for future lookups
    saveToLocalStorage(result);

    resolve(fonts);
  }));
}

/** Try to Load fonts from local storage, then from the file system
 * @returns {[Typeface]|null} Returns data, or null if there was a problem
 */
async function loadFonts() {
  let fonts = loadFromLocalStorage();

  if (fonts === null) {
    fonts = await loadFromFileSystem();
  }

  return fonts;
};

let fonts = null;

/** Create a readable store that only fetches from adobe application once
 *  All future uses use a localStorage cache
 */
export default readable({ fonts, }, set => {
  
  if (fonts === null) {
    fonts = loadFonts();
    set({ fonts, });
  }
  
  return () => void 0;
});
