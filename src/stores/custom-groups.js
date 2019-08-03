import { writable, derived } from "svelte/store";
import customGroupRepository from "repositories/custom-groups.js";
import CustomGroup from "datatypes/custom-group";


/**
 * 
 */
export const customGroups = writable([]);


export const createGroup = () => {
  let group = null;
  customGroups.update(values => {
    group = new CustomGroup(CustomGroup.getDefaultName(values), null, false);
    group.isNew = true;
    return [...values.map(g => (g.isNew = false, g)), group];
  });
  
  selected.set(group);
};

export const deleteSelectedGroup = () => {
  let group = null;

  selected.update( value => {
    group = value;
    return null;
  });

  customGroups.update(groups => groups.filter(g => g.ID !== group.ID));
}

export const removeTypefaceFromGroup = (group, typeface) => {
  customGroups.update( groups => {
    return groups.map(g => {
      
      if (g.ID === group.ID) {
        g.typefaces.remove(typeface);
      }

      return g;
    })
  });
}

export const renameGroup = (group, name) => {

  customGroups.update( values => {
    return values.map( g => {
      if (g.ID === group.ID) {
        g.name = name;
        g.isNew = false; // renames automatically expire a group
      }

      return g;
    });
  });

  selected.set(group);
};

export const expire = (group) => {
  customGroups.update( g => {
    if (g.ID === group.ID) {
      g.isNew = false;
    }
    return g;
  });
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

export const clearCustomGroups = () => {
  customGroups.set([]);
  selected.set(null);
  customGroupRepository.clear();
  customGroups.set([]);
}