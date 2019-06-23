import { writable } from "svelte/store";
import typefaceService from "services/typefaces.js";


/**
 * 
 */
export const typefaces = writable({});

/**
 * 
 */
export const loading = writable(true);

//
console.log("loading")
typefaceService.load().then( data => {
  typefaces.set(data);
  loading.set(false);

  // for testing
  // window.setTimeout(() => {
  //   console.log("loaded")
  //   loading.set(false);
  // }, 5000);
  // after the real data is laoded — any changes we then save to local storage
  typefaces.subscribe(data => typefaceService.save(data));
});

