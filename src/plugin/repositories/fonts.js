import tryParseJSON from "helpers/try-parse-json.js";
import csInterface from "helpers/cs-interface.js";
import { info, warning, error } from "helpers/logger.js";
import { runTimeError, ErrorWithData } from "stores/error-service.js";
import { Deferred } from "helpers/utils.js";

const GET_FONT_LIST_JSX = "getFontList()";
const LOCALSTORAGE_FONTS = "fonts";

// "cache" mechanisms
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_FONTS));
const saveToLocalStorage = (result) => localStorage.setItem(LOCALSTORAGE_FONTS, result);
const purgeFromLocalStorage = () => localStorage.removeItem(LOCALSTORAGE_FONTS);

const isEvalScriptError = (result) => (result || "").includes("EvalScript error");
const loadScript = (scriptName) => {

  const promise = new Deferred();

  csInterface.evalScript(scriptName, result => {
    if (isEvalScriptError(result)) {
      promise.reject(result);
      return;
    }

    promise.resolve(result);
  });

  return promise;
}


/** Loads the fonts using our host JSX function
 * @returns {Promise} Returns a promise that resolves to a Typefaces list, 
 *                    or rejects if it failed to retrieve data.
 */
const loadFromFileSystem = async () => {

  const loadFontDeferred = loadScript(GET_FONT_LIST_JSX).promise;

  loadFontDeferred.catch( evalError => {
    error(`EvalScript Error from '${GET_FONT_LIST_JSX}'`, evalError, "fonts repo");
  });

  let result = await loadFontDeferred;

  if (isEvalScriptError(result)) {
    result = null;
  }

  const fonts = tryParseJSON(result);

  if (fonts === null ) {
    throw new ErrorWithData(`Failed to fetch fonts from filesystem`, result);
  }

  const initialFontsLength = fonts.length;
  const set = new Set();
  const dupes = [];
  const uniqueFonts = fonts.filter( font => {
    if (set.has(font.postScriptName)) {
      dupes.push(font);
      return false;
    }

    set.add(font.postScriptName);
    
    return true;
  });
  
  const dupesCount = initialFontsLength - uniqueFonts.length;

  if (dupesCount > 0) {
    warning(`Found ${dupesCount} duplicate fonts.`, dupes, "font repo");
  }

  return uniqueFonts;
}

const serviceName = "fonts service";

/** Try to Load fonts from local storage, then from the file system
 * @returns {[Typeface]|null} Returns data, or null if there was a problem
 */
async function loadFonts(useLocalstorage) {
  info("Loading", null, serviceName);
  
  let fonts = null;

  if (useLocalstorage) {
    fonts = loadFromLocalStorage();
  }

  if (fonts === null) {
    warning("Fonts not in local storage", null, serviceName);
    info("Loading fonts from file system", null, serviceName);
    fonts = await loadFromFileSystem();
    info("fonts loaded from file system", fonts, serviceName);
  }
  else {
    info("fonts loaded from local storage", fonts, serviceName);
  }

  info("Loaded.", fonts, serviceName);

  return fonts;
};


/** Font Service
 * 
 */
export default {
  loadScript,
  GET_FONT_LIST_JSX,
  save: (data) => saveToLocalStorage(data),
  load: (useLocalstorage) => loadFonts(useLocalstorage),
  purge: () => purgeFromLocalStorage(),
}