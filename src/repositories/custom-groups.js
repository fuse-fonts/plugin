import tryParseJSON from "helpers/tryParseJSON.js";
import CustomGroup from "datatypes/custom-group.js";
import TypefaceLibrary from "../datatypes/typeface-library";


const LOCALSTORAGE_GROUPS = "custom-groups";


/**
 *
 */
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_GROUPS));



/**
 *
 */
const saveToLocalStorage = (result) => {
  const data = result.map(group => {

    const { name, ID } = group;
    const typefaces = TypefaceLibrary.toModel(group.typefaces);

    return { name, ID, typefaces };
  });

  const jsonData = JSON.stringify(data);

  localStorage.setItem(LOCALSTORAGE_GROUPS, jsonData);
}

/**
 *
 */
const removeFromLocalStorage = () => localStorage.removeItem(LOCALSTORAGE_GROUPS);


/** Custom Group Repository
 *  Exposes the `load` and `save` functions
 */
export default {

  load: async (typefaces) => {
    const data = loadFromLocalStorage();
    
    if (data === null) return data;
    
    const customGroups = data.map(groupData => {
      let group = new CustomGroup(groupData.name, groupData.ID, false);

      group.typefaces = TypefaceLibrary.populateFromModel(typefaces, groupData.typefaces);

      return group;
    });

    return customGroups
  },

  save: (data) => saveToLocalStorage(data),

  clear: () => removeFromLocalStorage(),
}
