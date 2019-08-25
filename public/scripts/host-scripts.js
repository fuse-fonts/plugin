/*
   this file registers mock  eval scripts called by `csInterface.evalScript`

   all functions should return JSON.stringified objects
*/



/** getFontList
 * @returns {Promise} resolves to List of fonts
 * @example font
 *   
 *     family: "Bahnschrift",
 *     name: "Bahnschrift",
 *     parent: "[Application Adobe Photoshop]",
 *     postScriptName: "Bahnschrift-LightSemiCondensed",
 *     style: "Light SemiCondensed",
 *     typename: "TextFont",
*/
window.getFontList = function() {
  return fetch('/scripts/fonts.json')
      .then(response => {
        if (response.status !== 200) return [];
        return response.json()
      })
    .then(json => JSON.stringify(json));
}

/** setFont
 * @returns {Promise} resolves to an object containing a "result" bool
 */
window.setFont = function(family, postScriptName, fontStyle) {

  return new Promise((resolve, reject) => {
    
    if (typeof window.CustomEvent === "function") {
      const detail = { family, postScriptName, fontStyle }
      var event = new CustomEvent("app-font-change", { detail });
      document.body.dispatchEvent(event);
    }
    
    resolve(JSON.stringify({
      result: true,
      message: "All Good."
    }));
  })
}


