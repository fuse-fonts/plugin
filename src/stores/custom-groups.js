import { writable } from "svelte/store";
import customGroupRepository from "repositories/custom-groups.js";


/**
 * 
 */
export const customGroups = writable([]);

export const loadCustomGroups = (typefaces) => {

  return customGroupRepository.load(typefaces).then((data) => {

    if (data !== null) {
      customGroups.set(data);
    }

    customGroups.subscribe(data => {
      customGroupRepository.save(data);
    });
  });
}