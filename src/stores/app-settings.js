import { writable } from "svelte/store";
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
