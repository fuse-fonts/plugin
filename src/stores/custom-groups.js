import { writable } from "svelte/store";
import customGroupRepository from "repositories/custom-groups.js";
import CustomGroup from "../datatypes/custom-group";


/**
 * 
 */
export const customGroups = writable([]);

/**
 *
 */
export const selected = writable(null);

/**
 *
 */
const allFonts = new CustomGroup("All Fonts", true);
export const allFontsGroup = writable(allFonts);

/**
 *
 */
export const loadCustomGroups = (typefaces) => {

  // create our "all fonts" group using all the typfaces
  allFonts.updateTypeFaces(typefaces);
  allFontsGroup.set(allFonts)
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