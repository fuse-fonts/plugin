/*
   this file registers mock  eval scripts called by `csInterface.evalScript`

   all functions should return JSON.stringified objects
*/

import getGoogleWebFonts from "/scripts/google-web-fonts-loader.mjs";
/**
 * The function to use if we want to use the pre-compiled list of fonts from a windows default installation.
 */
function getLocalFontList() {
  return fetch('/scripts/fonts.json')
    .then( response => {
      if (response.status !== 200) return [];
      return response.json();
    });
}

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

  // const source = getLocalFontList()
  const source = getGoogleWebFonts()

  return source.then( json => JSON.stringify(json));
}

/** setFont
 * @returns {Promise} resolves to an object containing a "result" bool
 */
window.setFont = function(family, postScriptName, fontStyle) {

  return new Promise((resolve, reject) => {
    
    if (window.parent !== window && window.parent.postMessage) {
      const action = "setFont";
      const font = { family, postScriptName, fontStyle };
      
      window.parent.postMessage({ action, font }, window.location.origin);
    }
    
    resolve(JSON.stringify({
      result: true,
      message: "All Good."
    }));
  })
}


