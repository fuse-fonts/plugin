import tryParseJSON from "helpers/tryParseJSON.js";
import { info, warning } from "helpers/logger.js";

const LOCALSTORAGE_SETTINGS = "user-settings";
const serviceName = "user settings";


/**
 *
 */
const loadFromLocalStorage = () => {
  info("Loading", null, serviceName);
  return tryParseJSON(localStorage.getItem(LOCALSTORAGE_SETTINGS));
}


/**
 *
 */
const saveToLocalStorage = (data) => {
  info("Changed", data, serviceName);
  localStorage.setItem(LOCALSTORAGE_SETTINGS, data);
};

const removeLocalStorage = () => {
  warning("Clearing", null, serviceName);
  return localStorage.removeItem(LOCALSTORAGE_SETTINGS);
}

export default {

  save: (data) => {
    const json = JSON.stringify(data);
    saveToLocalStorage(json);
  },

  load: () => loadFromLocalStorage(),

  reset: () => removeLocalStorage(),
}
