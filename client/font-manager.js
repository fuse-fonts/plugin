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
    // console.log(`Creating TypeFace for %c${family}`, "color: #b0b;")
    this.family = family;
    this.variants = [];
    this.isVisible = true;
    this.isSelected = false;

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


class CustomGroup {
  
  constructor(name) {
    this.name = name;
    this.typefaces = new TypeFaceLibrary();
    this.isActive = true;
  }

  updateTypeFaces(typefaces) {
    this.typefaces = typefaces;
  }

  saveChanges() {
    // todo
    // persist
  }
}

/**
 * Helper for handling typefaces
 */
class TypeFaceLibrary {

  /**
   * 
   * @param {TextFont} font 
   */
  from(font) {

    if (!this[font.family]) {
      this[font.family] = new TypeFace(font.family);
    }

    this[font.family].addVariant(font);
  }

  /**
  * Adds the parameter typeface to the library.
  * @param {TypeFace} typeface
  */
  add(typeface) {
    if (!this[typeface.family]) {
      this[typeface.family] = typeface;
    }
  }

  /**
   * Removes the parameter typeface from the library
   * @param {TypeFace} typeface 
   */
  remove(typeface) {
    if (typeface && typeface.family) {
      this[typeface.family] = void 0;
    }
  }

  toList() {
    return Object.values(this);
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
    this.typefaces = new TypeFaceLibrary();
    this.customGroups = [];

    // the selected typeface
    this.selected = null;

    // fonts is our raw data
    this.fonts = null;

    this.handlers = {

      toggleGroup(e) {
        let groupName = e.currentTarget.dataset.groupName;
        let customGroup = this.customGroups.find(g => g.name === groupName);
        if (customGroup) {
          customGroup.isActive = !customGroup.isActive;
        }
        e.currentTarget.parentNode.classList.toggle("--active");
      },

      toggleSelection(e) {

        const selectedClassName = "--selected";
        const family = e.currentTarget.dataset.family;
        const typeface = this.typefaces[family];
        
        console.log("selected:", family, e.currentTarget);
        
        if (typeface) {
          const state = !typeface.isSelected;
          that.toggleSelect(typeface, state);
          e.currentTarget.classList.toggle(selectedClassName, state);
        }
        else {
          // unknown situation, just remove selection
          e.currentTarget.classList.remove(selectedClassName);
        }
      },
    };

    // bind handlers
    for (let key in this.handlers) {
      this.handlers[key] = this.handlers[key].bind(that);
    }

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

  clearFilter() {
    this.typefaces.toList().forEach( t => t.isVisible = true );
    this.render();
  }

  filter(text) {

    if (text.length <= 1) return this.clearFilter();

    this.typefaces.toList().forEach(typeface => typeface.isVisible = typeface.family.toLowerCase().includes(text));
    this.render();

  }

  /**
   * Toggles a typeface's isSelected state and affects the `.actions` bar
   * @param {TypeFace} typeface 
   */
  toggleSelect(typeface, state = false) {

    // clear previous selection
    if (state && this.selected !== null && this.selected !== typeface) {
      this.selected.isSelected = false;
      document.querySelector(".--selected").classList.remove("--selected");
    }

    // set the typeface
    typeface.isSelected = state;

    this.selected = state ? typeface : null;

    // toggle the visual state of the actions bar
    Array.from(document.querySelectorAll(".actions__selection-actions .action")).forEach(el => el.classList.toggle("--disabled", !state));
  }

  /**
   * 
   * @param {[TextFont]} fonts
   */
  update(fonts) {

    console.log(this);

    this.fonts = fonts;
    fonts.forEach((font) => this.typefaces.from(font));
  }

  /**
   * Updates the preview text displayed next to each font.
   * @param {string} text 
   */
  updateText(text) {
    this.text = text.trim();
    if (this.text.length === 0) {
      this.text = this.defaultText;
    }
    this.render();
  }

  /**
   * returns `true` when parameter `name` is already the name of a group, `false` otherwise.
   * @param {string} name 
   */
  hasGroup(name) {
    return this.customGroups.findIndex(g => g.name === name) !== -1;
  }

  /**
   * Creates a `CustomGroup` instance with the argument `name`, and adds it to the `.customGroups` list.
   * @param {string} name 
   */
  createGroup(name) {
    const group = new CustomGroup(name);
    this.typefaces.toList().slice(0, 4).forEach(t => group.typefaces.add(t));
    this.customGroups.push(group);
    this.render();
  }

  /**
   * Not currently used
   * @param {TypeFace} typeface 
   */
  getVariancesHTML(typeface) {
    return typeface.variants.reduce((p, variant) => {
      let template = (`<div class="font__variant font__preview" style="${variant.style}">${variant.description}</div>`);
      return p + template;
    }, "");
  }

  /**
   * Removes all dynamic event listeners on specific re-rendered nodes, and re-listens to them.
   */
  refreshEventListeners() {

    const that = this;
    const options = { capture: true, passive: true, };

    console.log("Refreshing Listeners: group toggle")
    document.body.querySelectorAll(".group .group__title").forEach( el => {
      el.removeEventListener("click", that.handlers.toggleGroup, options);
      el.addEventListener("click", that.handlers.toggleGroup, options);
    });

    console.log("Refreshing Listeners: font select")
    document.body.querySelectorAll(".font").forEach( el => {
      el.removeEventListener("click", that.handlers.toggleSelection, options);
      el.addEventListener("click", that.handlers.toggleSelection, options);
    });

  }

  /**
   * Returns the rendered HTML of a custom group.
   * @param {CustomGroup} group 
   * @param {TypeFace[]} typefaces 
   * @param {string} text 
   */
  getCustomGroupHTML(group, typefaces, text) {
    
    const entries = this.getListHTML(typefaces, text);
    const isActive = group.isActive ? "--active" : "";

    return (`
      <article class="group ${isActive}">
        <h2 class="group__title" data-group-name="${group.name}">${group.name}</h2>
        <ol class="group__list font-list__list">${entries}</ol>
      </article>
    `);
  }

  /**
   * Returns the rendered HTML of a list of typefaces.
   * @param {TypeFace[]} typefaces
   * @param {string} text
   */
  getListHTML(typefaces, text) {
    if (typefaces.length > 0) {
      return typefaces.reduce((p, typeface) => {

        const family = typeface.family;
        const selectedClassName = typeface.isSelected ? "--selected" : "";
        const visibleStyle = typeface.isVisible ? "" : "display: none;";

        const entry = (`
            <li class="font ${selectedClassName}" style="${visibleStyle}" data-family="${family}">
              <div class="font__name">${typeface.family}</div>
              <div class="font__style-count">${typeface.variants.length} style${typeface.variants.length == 1 ? "" : "s"}</div>
              <div class="font__preview" style="font-family: '${family}'">${text}</div>
            </li>
          `);

        return p + entry;
      }, "");
    }
    else {
      return `<li class="empty">No fonts found.</li>`;
    }
  }

  /**
   * Renders the current state of all typefaces and custom groups to the DOM, then calls `FontManager.refreshEventListeners`
   */
  render() {

    const that = this;
    const { typefaces, text } = this;

    //
    // render our custom groups — if any
    //
    const $customGroups = document.querySelector(".font-list__groups");

    if (this.customGroups.length > 0) {
      $customGroups.innerHTML = this.customGroups.reduce((p, group) => {
        return p + that.getCustomGroupHTML(group, Object.values(group.typefaces), text);
      }, "");
    }
    else {
      $customGroups.innerHTML = `<h2 class="no-groups">No groups yet.</h2>`;
    }
    
    //
    // render the "All Fonts" section — not a real category
    //
    const $allFonts = document.querySelector(".all-fonts .font-list__list");

    $allFonts.innerHTML = this.getListHTML(typefaces.toList(), text);

    this.refreshEventListeners();
  }


}