import { writable } from "svelte/store";
import typefaceRepository from "repositories/typefaces.js";
import { loadCustomGroups } from "stores/custom-groups.js"
import { loading } from "stores/app-settings.js";

/**
 * 
 */
export const typefaces = writable({});

let unsubscribe;
//
export const loadData = (useLocalstorage) => typefaceRepository.load(useLocalstorage).then( async data => {
  
  // console.log("typeface data:", data);

  await loadCustomGroups(data);

  typefaces.set(data);
  

  // for testing
  // window.setTimeout(() => {
  //   console.log("loaded")
  //   loading.set(false);
  // }, 5000);
  // after the real data is laoded — any changes we then save to local storage
  unsubscribe = typefaces.subscribe(data => typefaceRepository.save(data));
});


export const clearData = () => {
  loading.set(true);
  unsubscribe();
  typefaceRepository.clear();
  loadData();
  window.setTimeout(() => loading.set(false), 2000);
}
