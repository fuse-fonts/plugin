import { writable, derived } from "svelte/store";
import csInterface from "helpers/cs-interface.js";

/**
 * 
 */
export const loading = writable(true);

export const persistant = writable(false);

// persistant.subscribe( value => setPersistance(value));

export function setPersistance(value) {
  console.log("Setting Persistance:", value)
  let eventName = `"com.adobe.Photoshop${value ? "" : "Un"}Persistent"`
  const event = new CSEvent(eventName, "APPLICATION");
  
  event.extensionId = csInterface.getExtensionID();
  csInterface.dispatchEvent(event);
}

export const appHeight = writable(window.innerHeight);
export const appWidth = writable(window.innerWidth);

export const appSize = derived([appWidth, appHeight], ([width, height]) => {
  return { width, height }
});

export const isPhotoshop = writable(true);

appSize.subscribe(v => console.log("App size changed: ", v));