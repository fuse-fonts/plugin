// if (BridgeTalk.appName === "photoshop") {
//   // do things
// }

/*
 things to note:

 
 app.refreshFonts();

 persistance: https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#html-extension-persistent

changing fonts programmatically:
https://forums.adobe.com/thread/539222
https://forums.adobe.com/thread/1497156
https://forums.adobe.com/thread/1941250

*/


function prop(input) {
  return '"' + input + '"';
}

function fontsToJSON(fonts) {

  // map all properties to be an object
  var blobs = [];
  for (var i = 0, ii = fonts.length; i< ii; i++) {
    var font = fonts[i];
    var properties = [];
    for (var key in font) {
      var value = font[key];
      properties.push(prop(key) + ":" + prop(value.toString()));
    }

    blobs.push("{" + properties.join(",") + "}");
  }
  
  var json = blobs.join(",");

  return "[" + json + "]";
}

function getFontList() {

  var fonts = [];
  for (var i = 0, ii = app.fonts.length; i < ii; i++) {
    var font = app.fonts[i];
    fonts.push(font);
  }

  return fontsToJSON(fonts);
}

// testing:
// getFontList();

// function getNotSelectedFont(selectedFont) {
//   for (var i = 0, ii = 3; i < ii; i++) {
//     var font = app.fonts[i];
    
//   }
// }


/**
 * Sets the currently selected layer's font to be the argument postScriptName
 * @param {string} postScriptName 
 */
function applyTypefaceByPostScriptName(postScriptName, style) {
  
  var response = {
    result: false,
    message: "No Document Open."
  };

  if (app.documents.length) {
    
    var activeLayer = app.activeDocument.activeLayer;
    response.message = "Current Layer is not a Text Layer."
    
    if (activeLayer.kind === LayerKind.TEXT) {
      try {
        
        activeLayer.textItem.font = postScriptName;
        activeLayer.textItem.style = style;
        response.result = true;
        response.message = "All Good.";
      }
      catch(e) {
        response.message = e;
      }
    }
  }
  return '{ "result":' + response.result.toString() + ', "message": "' + response.message + '" }';
}