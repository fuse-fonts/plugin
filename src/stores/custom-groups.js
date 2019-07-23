import { writable } from "svelte/store";
import customGroupRepository from "repositories/custom-groups.js";
import CustomGroup from "../datatypes/custom-group";


/**
 * 
 */
export const customGroups = writable([]);

export const renameGroup = (group, name) => {

  customGroups.update( values => {
    return values.map( g => {
      if (g.ID === group.ID) {
        g.name = name;
      }

      return g;
    });
  });

  selected.set(group);
}

/**
 *
 */
export const selected = writable(null);

/**
 *
 */
const allFonts = new CustomGroup("All Fonts", null, true);
export const allFontsGroup = writable(allFonts);

/**
 *
 */
export const loadCustomGroups = (typefaces) => {

  // create our "all fonts" group using all the typfaces
  allFonts.updateTypeFaces(typefaces);
  // allFontsGroup.set(allFonts)
  selected.set(allFonts);

  return customGroupRepository.load(typefaces).then((data) => {
    if (data !== null) {
      customGroups.set(data);
    }

    customGroups.subscribe(data => {
      customGroupRepository.save(data);
    });
  });
}