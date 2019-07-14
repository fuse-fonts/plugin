import { writable, get } from "svelte/store";
import TypefaceLibrary from "datatypes/typeface-library.js";
import { typefaces } from "stores/typefaces";
import TypeFace from "datatypes/typeface";



function selectionStore(initialValue = new TypefaceLibrary()) {
  
  // the internal data model takes this form
  //  "typeface": ["selected-variant-1", "selected-variant-2"]
  // 
  const store = writable({});
  const { subscribe, set, update } = store;

  subscribe( store => console.log("selection changed:", store));

  const byVariantName = variant => variant.name;
  

  /** selectTypeface
   *  
   */
  const selectTypeface = (typeface) => update(model => {
    model[typeface.family] = typeface.variants.map(byVariantName);
    return model;
  });


  /** deselectTypeface
   *
   */
  const  deselectTypeface = (typeface) => update(model => {
    delete model[typeface.family];
    return model;
  });

  /** toggleTypeface
   *
   */
  const toggleTypeface = (typeface, toggle) => toggle ? selectTypeface(typeface) : deselectTypeface(typeface);

  /** selectVariant
   * 
   */
  const selectVariant = (typeface, variant) => update(model => {

    if (!model[typeface.family]) {
      model[typeface.family] = [];
    }

    let variants = model[typeface.family];

    // toggle the variant
    if (!variants.includes(variant.name)) {
      variants.push(variant.name);
    }

    return  model;
  });


  /** deselectVariant
   * 
   */
  const deselectVariant = (typeface, variant) => update(model => {
    
    model[typeface.family] = variants.filter(v => v !== variant.name);

    // if the length of the list is 0, we deselect the entire
    if (model[typeface.family].length === 0) {
      delete model[typeface.family];
    }
    return model;
  });

  /** toggleVariant
  *
  */
  const toggleVariant = (typeface, variant) => update(model => {

    // if the typeface isn't selected:
    // then select it with the sole variant
    if (!model[typeface.family]) {
      model[typeface.family] = [variant.name];
      return model;
    }

    let variants = model[typeface.family];

    // toggle the variant
    if (variants.includes(variant.name)) {
      variants = variants.filter(v => v !== variant.name);
    }
    else {
      variants.push(variant.name);
    }


    if (variants.length === 0) {
      delete model[typeface.family];
    }
    else {
      model[typeface.family] = variants;
    }

    return model;

  });

  /** clear
   *
   */
  const clear = () => set({});

  //
  // the store's API
  //
  return {

    subscribe,
    selectTypeface,
    deselectTypeface,
    toggleTypeface,
    selectVariant,
    deselectVariant,
    toggleVariant,
    clear,

    get: () => {
      const $typefaces = get(typefaces);
      const $store = get(store);

      console.warn("get() not implemented fully");
      
      const library = new TypefaceLibrary();
      for (let family in $store) {

        const variants = $store[family];
        const typeface = TypeFace.clone($typefaces.get(family), variants);

        if (typeface !== null) {
          library.add(typeface);
        }
      }

      return library;
    }
    
  }
};


export const selected = selectionStore();