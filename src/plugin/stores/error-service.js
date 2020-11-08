import { writable, derived, get } from "svelte/store";
import csInterface from "helpers/cs-interface.js";
import fileSystem from "repositories/file-system.js";
import uuid from "helpers/uuid.js";
import { info, logStore, levelName } from "helpers/logger.js";

const apiVersion = csInterface.getCurrentApiVersion();
const cepVersion = `${apiVersion.major}.${apiVersion.minor}.${apiVersion.micro || 0}`
const env = csInterface.hostEnvironment;

const deviceDetails = [
  `\tPhotoshop Version: ${env.appVersion}`,
  `\tCEP Version: ${cepVersion}`,
  `\tOS: ${csInterface.getOSInformation()}`,
  `\tUI Display Scale: ${csInterface.getScaleFactor()}`,
].join("\n");


function logToText() {
  return get(logStore).map((entry, index) => {
    const level = levelName(entry.level);
    let text = `${index + 1}\t[${entry.service || "app"}]\n\t${level}:\t${entry.message}`;
    
    if (entry.details) {
      text += `\n\t\t${entry.details}`;
    }

    return text;
  }).join("\n");
}



export function createErrorText(error) {
  
  const content = [
    `FUSE FONTS LOGFILE`,
    `timestamp: ${new Date().toLocaleString()}`,
    `message: ${error.message}`,
    `stack trace: ${error.stack}`,
    `device details: \n${deviceDetails}`,
    `Runtime logs: \n${logToText()}`,
    `data: ${error.data}`,
    "END"
  ].join("\n\n===========\n\n");

  return content;
}

function saveToDisk(error) {
  const id = uuid();
  const content = createErrorText(error);

  return fileSystem.saveErrorFile(id, content)
      .catch((error) => {
          alert(`Unable to save to disk: ${error.message}`);
      })
      .then( path => {
          console.log("Error saved to disk");
          console.log(`file:///${path}`);
          return `file:///${path}`;
      });
}

/**
 * An error that has caused the plugin to be unstable
 */
export const runTimeError = (() => {
  const { set, update, subscribe } = writable(null);

  const _set = (message, data) => update(() => new ErrorWithData(message, data));
  const clear = () => set(null);

  return {
    set: _set,
    clear, 
    update, 
    subscribe,
  }
})();

export const errorLogFiles = writable([]);

runTimeError.subscribe( $runTimeError => {
  if ($runTimeError !== null) {
    info("Caught Runtime Error", $runTimeError.message, "error service");
    saveToDisk($runTimeError).then( path => errorLogFiles.update( items => [...items, path]));
  }
});


export const hideRuntimeError = writable(false);

/**
 * Whether runTimeError is null
 */
export const hasRuntimeError = derived([runTimeError, hideRuntimeError], ([$runTimeError, $hideRuntimeError]) => $runTimeError !== null && !$hideRuntimeError);

export class ErrorWithData extends Error {
  constructor(message, data) {
    super(message);
    this.data = typeof data === "undefined" ? null : data;
  }
}