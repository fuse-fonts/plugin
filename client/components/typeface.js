const fontStyleHelper = new FontStyle();

/** 
 * A grouping of fonts and their variations
 * @param family the font family this typeface represents
*/
class TypeFace {

  constructor(family) {
    // console.log(`Creating TypeFace for %c${family}`, "color: #b0b;")
    this.family = family;
    this.variants = [];
    this.isVisible = true;
    this.isSelected = false;
    this.defaultVariant = null;

    this.renderFontFace = this.renderFontFace.bind(this);
    this.addVariant = this.addVariant.bind(this);
  }

  addVariant(font) {
    const name = TypeFace.toID(font.postScriptName);
    const style = TypeFace.mapFontToCSS(font);
    const variant = { name, style, font, description: font.style, parent: this, };
    
    // we try to determine which variant is the regular or base font, but if we can't we just use the first added.
    if (this.variants.length === 0 || variant.style.toLowerCase() === "regular") {
      console.log(`Settomg default variant of "${this.family}" to "${variant.font.postScriptName}"`)
      this.defaultVariant = variant.font.postScriptName;
    }

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

      if (fontStyleHelper.isStyle(prop)) p.push(fontStyleHelper.cssStyle(prop));
      else if (fontStyleHelper.isWidth(prop)) p.push(fontStyleHelper.cssWidth(prop));
      else if (fontStyleHelper.isWeight(prop)) p.push(fontStyleHelper.cssWeight(prop));

      return p;
    }, []);

    return css.join(" ");
  }

}