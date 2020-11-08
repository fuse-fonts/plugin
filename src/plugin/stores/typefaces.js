import { writable } from "svelte/store";
import typefaceRepository from "repositories/typefaces.js";
import { loadCustomGroups } from "stores/custom-groups.js"
import { loading } from "stores/app-settings.js";
import { runTimeError } from "stores/error-service.js";

/**
 * 
 */
export const typefaces = writable(null);


let unsubscribe = null;
//
export const loadData = (useLocalstorage) => {
  return typefaceRepository.load(useLocalstorage)
    .then( async data => {
      await loadCustomGroups(data);
      typefaces.set(data);
      // after the real data is loaded — any changes we then save to local storage
      unsubscribe = typefaces.subscribe(data => typefaceRepository.save(data));
    })
    .catch((ex) => {
      runTimeError.set(ex.message, ex.data);
    });
};


export const clearData = async () => {
  loading.set(true);
  if (unsubscribe !== null) {
    unsubscribe();
    unsubscribe = null;
  }
  typefaceRepository.clear();
  await loadData();
  window.setTimeout(() => {
    loading.set(false);
  }, 2000);
}
