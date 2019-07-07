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

//
console.log("loading");
typefaceRepository.load().then( async data => {
  
  console.log("typeface data:", data);

  await loadCustomGroups(data);

  typefaces.set(data);
  loading.set(false);

  // for testing
  // window.setTimeout(() => {
  //   console.log("loaded")
  //   loading.set(false);
  // }, 5000);
  // after the real data is laoded — any changes we then save to local storage
  typefaces.subscribe(data => typefaceRepository.save(data));
});

