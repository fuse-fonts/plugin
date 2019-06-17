
window.resultsLog = {};

/**
 * Helper for attempting to parse a JSON response from the host
 * @param {string} input The JSON string result returned from the host script.
 */

export default (json) => {

  // we also log results
  const logTimeKey = new Date().toLocaleString();
  resultsLog[logTimeKey] = json;

  try {
    return JSON.parse(json);
  }
  catch (e) {
    let message = "Could not parse JSON";
    console.warn(message);
    console.error(e);
    return null;
  }
}
