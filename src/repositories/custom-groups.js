import tryParseJSON from "helpers/tryParseJSON.js";
import CustomGroup from "datatypes/custom-group.js";


const LOCALSTORAGE_GROUPS = "custom-groups";


/**
 *
 */
const loadFromLocalStorage = () => tryParseJSON(localStorage.getItem(LOCALSTORAGE_GROUPS));



/**
 *
 */
const saveToLocalStorage = (result) => {
  const data = result.map(g => {
    const { name } = g;
    const typefaces = g.typefaces.toList().map(t => t.family);
    return { name, typefaces };
  });

  const jsonData = JSON.stringify(data);

  localStorage.setItem(LOCALSTORAGE_GROUPS, jsonData);
}

/**
 *
 */
const purgeFromLocalStorage = () => localStorage.removeItem(LOCALSTORAGE_GROUPS);


/** Custom Group Repository
 *  Exposes the `load` and `save` functions
 */
export default {

  load: async (typefaces) => {
    const data = loadFromLocalStorage();
    
    if (data === null) return data;

    const customGroups = data.map(groupData => {
      let group = new CustomGroup(groupData.name);

      groupData.typefaces.forEach(name => {
        if (typefaces.includes(name)) {
          group.typefaces.add(typefaces.get(name));
        }
      })

      typefaceList
        .filter(t => groupData.typefaces.includes(t.family)) // get all typefaces referenced
        .reduce((lib, t) => (lib.add(t), lib), group.typefaces);

      return group;
    });

    return customGroups
  },

  save: (data) => saveToLocalStorage(data),


}
