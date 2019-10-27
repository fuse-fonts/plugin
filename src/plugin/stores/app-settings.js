import { writable, readable } from "svelte/store";
import csInterface from "helpers/cs-interface.js";

/** app-settings
 *  App settings are runtime settings for controlling various top-level aspects of the experience.
 */

 /** loading
  * A store for controlling if the application is loading or not
  */
export const loading = writable(true);

/**
 * A store for controlling if the application is persistant or not. 
 * 
 */
export const persistant = writable(false);

// NOTE: persistance is DISABLED —  as it isn't always the best experience and introduces odd layout problems
// persistant.subscribe( value => setPersistance(value));

/** setPersistance
 * Set persistance via firing a CSEVENT for photoshop 
 * @param {bool} value 
 */
export function setPersistance(value) {
  console.log("Setting Persistance:", value)
  let eventName = `"com.adobe.Photoshop${value ? "" : "Un"}Persistent"`
  const event = new CSEvent(eventName, "APPLICATION");
  
  event.extensionId = csInterface.getExtensionID();
  csInterface.dispatchEvent(event);
}

export const isPhotoshop = writable(true);

export const outputLogToConsole = writable(true);

/** fontPreviewAvailable
 * A store to control if we should allow font previews to be displayed
 * At smaller screen sizes it could look very broken
 */
const mql = window.matchMedia('(min-width: 36rem)');
export const fontPreviewAvailable = readable(mql.matches, set => {

  const update = event => set(event.matches);

  mql.addListener(update);
  const unlisten = () => mql.removeListener(update);

  return unlisten;
});