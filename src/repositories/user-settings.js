import tryParseJSON from "helpers/tryParseJSON.js";

const LOCALSTORAGE_SETTINGS = "user-settings";


/**
 *
 */
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_SETTINGS));


/**
 *
 */
const saveToLocalStorage = (data) => {
  localStorage.setItem(LOCALSTORAGE_SETTINGS, data);
};

const removeLocalStorage = () => localStorage.removeItem(LOCALSTORAGE_SETTINGS);

export default {

  save: (data) => {
    const json = JSON.stringify(data);
    saveToLocalStorage(json);
  },

  load: () => loadFromLocalStorage(),

  reset: () => removeLocalStorage(),
}
