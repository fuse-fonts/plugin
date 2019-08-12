import { writable } from "svelte/store";

export let entries = [];
export const logStore = writable(entries);

export const logToConsole = true;

window.appLog = entries;
const key = "LOG_LEVEL_"

export const LOG_LEVEL_INFO     = Symbol.for(`${key}INFO`);
export const LOG_LEVEL_WARNING  = Symbol.for(`${key}WARNING`);
export const LOG_LEVEL_ERROR    = Symbol.for(`${key}ERROR`);

export const info     = (...rest) => log(LOG_LEVEL_INFO, ...rest);
export const warning  = (...rest) => log(LOG_LEVEL_WARNING, ...rest);
export const error    = (...rest) => log(LOG_LEVEL_ERROR, ...rest);

/** log
 *  Generic log for logging application information
 * @param {Symbol} level the log level (info|warning|error)
 * @param {string} message A message to descibe this log
 * @param {Object} details additional information to include with the log
 */
export function log(level, message, details, service) {

  const time = new Date().toLocaleString();
  const entry = { time, level, message, details, service }; 
  
  entries.push(entry);

  if (logToConsole) {
    const title = !entry.service ? `${entry.message}%c` : `${entry.service}: %c${entry.message}`;
    const color = "color: #0a5; font-weight: 400;";
    console.groupCollapsed(title, color)
    console.log(entry);
    console.groupEnd(title, color)
  }

  logStore.set( entries );
}

/** getLogelLevelName
 *  Helper for get
 * @param {Symbol} level 
 */
export function levelName(level) {
  return Symbol.keyFor(level).replace(key, "").toLowerCase();
}

export function clearLogs() {
  entries = [];
  logStore.set([]);
}