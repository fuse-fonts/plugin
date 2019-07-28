import { writable } from "svelte/store";
import typefaceRepository from "repositories/typefaces.js";
import { loadCustomGroups } from "stores/custom-groups.js"

/**
 * 
 */
export const typefaces = writable({});

/**
 * 
 */
export const loading = writable(true);

let unsubscribe;
//
export const loadData = () => typefaceRepository.load().then( async data => {
  
  console.log("typeface data:", data);

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


console.log("loading");
loadData();
loading.set(false);
