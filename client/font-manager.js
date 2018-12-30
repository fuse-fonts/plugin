const html = new (class Templates {

  fontFace(id, family) {
    let style = document.createElement("style");
    style.id = id;
    style.innerHTML = (`
        @font-face {
          font-family: '${family}';
          src:  local('${family}');
        }
    `);
    return style;
  }
});


/**
 * Static Helper class for transforming TextFont descriptors into CSS Web Font properties
 */
const fontStyleHelper = new class FontStyle {

  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch
    this.widths = {
      "ultracondensed":   "ultra-condensed",
      "extracondensed":   "extra-condensed",
      "condensed":        "condensed",
      "semicondensed":    "semi-condensed",
      "normal":           "normal",
      "semiextended":     "semi-expanded",
      "extended":         "expanded",
      "wide":             "extra-expanded",      
    };
    
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
    this.styles = {
      "italic": "italic",
      "oblique": "oblique",
    };

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
    this.weights = {
      "thin":         "100",
      "ultralight":   "200",
      "extralight":   "200",
      "light":        "300",
      "regular":      "400",
      "medium":       "500",
      "semibold":     "600",
      "bold":         "700",
      "extrabold":    "800",
      "black":        "900",
      "ultrablack":   "1000",
    };
    
    // these aren't currently used
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
    this.opticalSizes = {
      "poster":       "",
      "display":      "",
      "subheading":   "",
      "regular":      "",
      "small":        "",
      "text":         "",
      "caption":      "",
    };

    // bind all fn's
    for (let key in this) {
      let property = this[key];
      if (typeof property === "function") this[key] = this[key].bind(this);
    }

  }

  isWidth(prop) {
    return typeof this.widths[prop] !== "undefined";
  }

  isStyle(prop) {
    return typeof this.styles[prop] !== "undefined";
  }

  isWeight(prop) {
    return typeof this.weights[prop] !== "undefined";
  }

  cssWidth(prop) {
    let value = this.widths[prop];
    return `font-stretch: ${value};`;
  }

  cssStyle(prop) {
    let value = this.styles[prop];
    return `font-style: ${value};`;
  }

  cssWeight(prop) {
    let value = this.weights[prop];
    return `font-weight: ${value};`;
  }
}


/** 
 * A grouping of fonts and their variations
 * @param family the font family this typeface represents
*/
class TypeFace {

  constructor(family) {
    console.log(`Creating TypeFace for %c${family}`, "color: #b0b;")
    this.family = family;
    this.variants = [];

    this.renderFontFace = this.renderFontFace.bind(this);
    this.addVariant = this.addVariant.bind(this);
  }

  addVariant(font) {
    const name = TypeFace.toID(font.postScriptName);
    const style = TypeFace.mapFontToCSS(font);
    const variant = { name, style, font, description: font.style, parent: this, };
    this.variants.push(variant);
  }

  renderFontFace() {
    let id = TypeFace.toID(this.family);
    if (document.getElementById(id) != null) {
      let head = document.getElementsByTagName("head");
      let styleNode = html.fontFace(id, this.family);
      head.append(styleNode);
    }
  }

  /**
   * Transforms a name into a kebab-style ID
   * @param {string} name
   */
  static toID(name) {
    return name.toLowerCase().replace(/ /gi, "-");
  }

  /**
   * Transforms a TextFont's `style` properties into their corrosponding CSS property and values.
   * @param {TextFont} font
   * @returns {string} `string`
   */
  static mapFontToCSS(font) {
    let { style } = font;
    let parts = style.split(" ").map(p => p.toLowerCase());
    
    let css = parts.reduce((p, prop) => {

      if (fontStyleHelper.isStyle(prop))        p.push(fontStyleHelper.cssStyle(prop));
      else if (fontStyleHelper.isWidth(prop))   p.push(fontStyleHelper.cssWidth(prop));
      else if (fontStyleHelper.isWeight(prop))  p.push(fontStyleHelper.cssWeight(prop));
      
      return p;
    }, []);

    return css.join(" ");
  }

}



class FontManager {

  constructor(csInterface, $list) {

    let that = this;
    this.cs = csInterface;
    this.$list = $list;
    this.text = "AaBbCc";
    this.defaultText = "AaBbCc";
    // typefaces is the family-grouping of fonts
    this.typefaces = new (class TypeFaceLibrary {
      add(font) {

        if (!this[font.family]) {
          this[font.family] = new TypeFace(font.family);
        }

        this[font.family].addVariant(font);
      }
    });

    // fonts is our raw data
    this.fonts = null;
  }

  refresh() {

    return new Promise((resolve, reject) => {
      csInterface.evalScript("getFontList()", (result) => {
  
        console.groupCollapsed("result");
        console.log(result);
        console.groupEnd("result");
        
        let fonts = null;
  
        try {
          fonts = JSON.parse(result);
        }
        catch (e) {
          let message = "Could not parse JSON from jsx payload";
          console.warn("Could not parse JSON from jsx payload");
          console.error(e);
          return reject();
        }
        
        this.update(fonts);
        resolve();
      });
    });

  }

  //
  update(fonts) {
    console.log(fonts);
    this.fonts = fonts;
    fonts.forEach((font) => this.typefaces.add(font));
  }

  updateText(text) {
    this.text = text.trim();
    if (this.text.length === 0) {
      this.text = this.defaultText;
    }
    this.render();
  }

  /**
   * Not currently used
   * @param {TypeFace} typeface 
   */
  renderVarianceList(typeface) {
    return typeface.variants.reduce((p, variant) => {
      let template = (`<div class="font__variant font__preview" style="${variant.style}">${variant.description}</div>`);
      return p + template;
    }, "");
  }

  /**
   * 
   */
  render() {

    const { typefaces, $list, text } = this;
    const typeFaceList = Object.keys(this.typefaces);

    if (typeFaceList.length > 0) {

      $list.innerHTML = typeFaceList.reduce((p, family) => {

        let typeface = typefaces[family];

        let template = (`
          <li class="font">
            <div class="font__name">${typeface.family}</div>
            <div class="font__style-count">${typeface.variants.length} style${typeface.variants.length == 1 ? "" : "s"}</div>
            <div class="font__preview" style="font-family: '${family}'">${text}</div>
          </li>
        `);

        return p + template;
      }, "");
    }
    else {
      $list.innerHTML = `<li class="empty">No fonts found.</li>`;
    }
  }


}