import tryParseJSON from "helpers/tryParseJSON.js";
import CustomGroup from "datatypes/custom-group.js";
import TypefaceLibrary from "datatypes/typeface-library";
import fileSystemRepository from "repositories/file-system.js";


const LOCALSTORAGE_GROUPS = "custom-groups";


/**
 *
 */
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_GROUPS));


/**
 *
 */
const saveToLocalStorage = (data) => {
  localStorage.setItem(LOCALSTORAGE_GROUPS, data);
};


/**
 *
 */
const removeFromLocalStorage = () => localStorage.removeItem(LOCALSTORAGE_GROUPS);

const convertModelToJSON = (result) => {
  const data = result.map(group => {

    const { name, ID } = group;
    const typefaces = TypefaceLibrary.toModel(group.typefaces);

    return { name, ID, typefaces };
  });

  return JSON.stringify(data);
}


/** Custom Group Repository
 *  Exposes the `load` and `save` functions
 */
export default {

  load: async (typefaces) => {
    
    // if we can't laod from local storage, try our file system backup
    const data = loadFromLocalStorage() || fileSystemRepository.load();

    // if the result is still null, we have no data
    if (data === null) {
      return null;
    }
    
    const customGroups = data.map(groupData => {
      let group = new CustomGroup(groupData.name, groupData.ID, false);

      group.typefaces = TypefaceLibrary.populateFromModel(typefaces, groupData.typefaces);

      return group;
    });

    return customGroups
  },

  save: (data) => {
    const json = convertModelToJSON(data);
    // save for fast access
    saveToLocalStorage(json);
    // and also save to file system as a backup
    fileSystemRepository.save(json);
  },

  clear: () => removeFromLocalStorage(),
}
