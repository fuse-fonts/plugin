if (BridgeTalk.appName === "photoshop") {
  // do things
}

/*
 things to note:

 app.fonts.index();
 app.fonts.getByName();

 
 app.refreshFonts();

 persistance: https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#html-extension-persistent

changing fonts programmatically:
https://forums.adobe.com/thread/1497156

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