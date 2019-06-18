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
typefaceService.load().then( data => {
  typefaces.set(data);
  loading.set(false);
  
  // after the real data is laoded — any changes we then save to local storage
  typefaces.subscribe(data => typefaceService.save(data));
});

