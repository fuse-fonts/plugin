
import { info as logInfo, error as logError } from "helpers/logger.js";

/**
 * Helper for attempting to parse a JSON response from the host
 * @param {string} input The JSON string result returned from the host script.
 */

export default (json) => {

  // we also log results
  const time = new Date().toLocaleString();
  
  let result = null;
  
  try {
    result = JSON.parse(json);
  }
  catch (e) {
    let message = "Failed to parse JSON";
    console.warn(message);
    console.error(e);
    logError(message, { json, error: e });
  }
  
  // an error was never thrown
  if (result !== null) {
    logInfo("JSON parsed", result);
  }

  return result;
}
