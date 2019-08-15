
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

function refreshPhotoshopFonts() {
  app.refreshFonts();
  return '{ "result": true, "message": null }';
}

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

        response.result = true;
        response.message = "All Good.";

      }
      catch(e) {
        response.message = e.message;
      }
    }
  }
  return response; 
}


/** setFont
 *  Change the current font based on the family, postscriptname, and style
 * Note: this code was generated from ScriptListener, and tweaked to allow parameters. it's not easy to read.
 * @param {string} family The human=readable font family, like "Birch Std"
 * @param {string} postScriptName the on-file name of the font, like "Birch-Std"
 * @param {string} fontStyle the style of the font, liek "Regular" or "SemiBold"
 */
function setFont(family, postScriptName, fontStyle) {

  var response = applyTypefaceByPostScriptName(postScriptName);

  if (response.result) {
    /* ========================================== */
    var idsetd = charIDToTypeID("setd");
    var desc4750 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref241 = new ActionReference();
    var idPrpr = charIDToTypeID("Prpr");
    var idTxtS = charIDToTypeID("TxtS");
    ref241.putProperty(idPrpr, idTxtS);
    var idTxLr = charIDToTypeID("TxLr");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref241.putEnumerated(idTxLr, idOrdn, idTrgt);
    desc4750.putReference(idnull, ref241);
    var idT = charIDToTypeID("T   ");
    var desc4751 = new ActionDescriptor();
    var idtextOverrideFeatureName = stringIDToTypeID("textOverrideFeatureName");
    desc4751.putInteger(idtextOverrideFeatureName, 808465457);
    var idtypeStyleOperationType = stringIDToTypeID("typeStyleOperationType");
    desc4751.putInteger(idtypeStyleOperationType, 3);
    var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
    // desc4751.putString( idfontPostScriptName, """Bahnschrift-SemiLightCondensed""" );
    desc4751.putString(idfontPostScriptName, postScriptName);
    var idFntN = charIDToTypeID("FntN");
    //desc4751.putString( idFntN, """Bahnschrift""" );
    desc4751.putString(idFntN, family);
    var idFntS = charIDToTypeID("FntS");
    desc4751.putString(idFntS, fontStyle);
  
    var idTxtS = charIDToTypeID("TxtS");
    desc4750.putObject(idT, idTxtS, desc4751);

    try {
      executeAction(idsetd, desc4750, DialogModes.NO);
    }
    catch (e) {
      response.message = e.message;
    }
  }

  response.message = response.message.replace("\n", "");

  var notATextLayerError = "Could not complete the command because a text layer is not selected.";

  if (response.message.indexOf(notATextLayerError) >= 0) {
    response.message = notATextLayerError;
  }

  return '{ "result":' + response.result.toString() + ', "message": "' + response.message + '" }';;
}
