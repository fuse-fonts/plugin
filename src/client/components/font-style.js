/**
 * Static Helper class for transforming TextFont descriptors into CSS Web Font properties
 */
class FontStyle {

  constructor() {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch
    this.widths = {
      "ultracondensed": "ultra-condensed",
      "extracondensed": "extra-condensed",
      "condensed": "condensed",
      "semicondensed": "semi-condensed",
      "normal": "normal",
      "semiextended": "semi-expanded",
      "extended": "expanded",
      "wide": "extra-expanded",
    };

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
    this.styles = {
      "italic": "italic",
      "oblique": "oblique",
    };

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
    this.weights = {
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

    // these aren't currently used
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
    this.opticalSizes = {
      "poster": "",
      "display": "",
      "subheading": "",
      "regular": "",
      "small": "",
      "text": "",
      "caption": "",
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