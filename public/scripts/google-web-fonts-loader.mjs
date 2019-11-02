/**
 * Fetches the list of all fonts from the Google Web Fonts Developer API, sorted by "trending" parameter
 * @param {int} count The number of results to return
 * @returns {WebFont[]} List of metadata about Google Web Fonts
 */
function fetchGoogleWebFontsList(count = Infinity) {
  const APIKey = "AIzaSyAQTmtx6wzTm7DuQGvTK9U4aVYagRicPTA";
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${APIKey}&sort=trending&fields=items`;

  return fetch(url)
    .then(response => {
      if (response.status !== 200) return [];
      return response.json();
    })
    .then(json => json.items.slice(0, count))
}

/**
 * Builds the <link /> for loading webfonts
 * @see <link href="https://fonts.googleapis.com/css?family=McLaren|Roboto&display=swap" rel="stylesheet">
 * @param {WebFont[]} webFontsList 
 */
function loadWebFontsStyleSheet(webFontsList) {

  // build the url
  // https://developers.google.com/fonts/docs/developer_api#details
  const srcURL = webFontsList.reduce((url, webFont, i) => {

    const separator = i === 0 ? "" : "|";
    const family = webFont.family.replace(/ /g, "+");
    let variants = "";
    if (webFont.variants.length > 1) {
      variants = `:${webFont.variants.join(",")}`;
    }

    return `${url}${separator}${family}${variants}`;
  }, "https://fonts.googleapis.com/css?family=");

  console.log(srcURL);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = srcURL;
  
  if (window.parent !== window && window.parent.postMessage) {
    const action = "loadWebFontsStyleSheet"
    const googleWebFontsURL = srcURL;

    window.parent.postMessage({ action, googleWebFontsURL }, window.location.origin);
  }
  window.requestIdleCallback(() => {
    document.head.append(link);
  });

}



/** Parses the webfont name and combines it with the family to create a TextFont
 * @param {string} family 
 * @param {string} name 
 */
function toTextFont(family, webFontStyles) {
  // from font-style-parser.js
  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
  const weightsLookup = {
    "thin": "100",
    "ultralight": "200",
    "extralight": "200",
    "light": "300",
    "regular": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700",
    "extrabold": "800",
    "black": "900",
    "ultrablack": "1000",
  };

  const reverseWeightsLookup = Object.keys(weightsLookup).reduce((map, key) => {
    const value = weightsLookup[key];
    map[value] = key;
    return map;
  }, {});

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
  const stylesLookup = {
    "italic": "italic",
    "oblique": "oblique",
  };

  const variants = [];

  // case: sometimes it's just "regular"
  if (webFontStyles.toLowerCase() === "regular") {
    variants.push(webFontStyles);
  }
  // case: sometimes it's just "italic"
  else {
    const foundStyle = Object.keys(stylesLookup).find(style => style === webFontStyles.toLowerCase()) || null;
    if (foundStyle !== null) {
      variants.push(foundStyle);
    }
    // case: combination of weight and style, like "700italic"
    else {
      const weight = parseInt(webFontStyles, 10); // this will parse 700 out of things like "700italic"
      // if you parseInt("italice"), it will be NaN—but we handled that case above, 
      // so this is more about safety from a style not being caught in the case above
      if (!isNaN(weight)) {
        const variantWeight = reverseWeightsLookup[weight.toString()];
        variants.push(variantWeight);

        const containedStyle = Object.keys(stylesLookup).find(style => {
          return webFontStyles.toLowerCase().includes(style);
        }) || null;

        if (containedStyle !== null) {
          variants.push(containedStyle);
        }

      }

    }
  }

  const style = variants.join(" ");
  let postScriptName = family;
  let name = family;

  if (variants.length > 0) {
    postScriptName = `${family.replace(/ /gi, "")}-${style}`; //  the post-script name _should_ be the filename associated with google fonts, but it likely won't matter
    name = `${family} ${variants.join("")}`;
  }

  return {
    name,
    postScriptName,
    style,
    family,
  };

}

/**
 * Converts the list of Google WebFontsList to the adobe-style of listed fonts that we recieve from Adobe's host script
 * Which is a list of these items:
 * @example from fonts.json
 *   name: "Candara Light Italic",
 *   postScriptName: "Candara-LightItalic",
 *   family: "Candara",
 *   style: "Light Italic",
 */
function toAdobeFontList(webFontsList) {

  return webFontsList.reduce((list, webfont) => {

    const { family, variants } = webfont;

    // we split each variant into it's own item, but each webfont counts as the family
    let variantFontList = variants.map(variant => toTextFont(family, variant));

    return list.concat(variantFontList);
  }, []);

}


/**
 * 
 */
export default function getGoogleWebFonts() {
  return fetchGoogleWebFontsList(60)
    .then(webFontsList => {
      loadWebFontsStyleSheet(webFontsList);
      return webFontsList;
    })
    .then(webFontsList => toAdobeFontList(webFontsList))
}

