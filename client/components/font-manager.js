/**
 * Helper for attempting to parse a JSON response from the host
 * @param {string} input The JSON string result returned from the host script.
 */
window.resultsLog = {};
const tryParseJSON = (input) => {

  // we also log results
  const logTimeKey = new Date().toLocaleString();
  resultsLog[logTimeKey] = input;

  console.log("Logged a result into %cresultsLog", "color: #06a; font-family: monospace;");

  try {
    return JSON.parse(input);
  }
  catch (e) {
    let message = "Could not parse JSON from jsx payload";
    console.warn("Could not parse JSON from jsx payload");
    console.error(e);
    return null;
  }
}

/**
 * Helper instance to help with rendering things.
 * Todo: figure out if I keep going this route or incorporate lit-HTML
 */
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

    const $tray = document.querySelector(".groups-tray");
    this.tray = new CustomGroupTray(this, $tray);

    // the selected typeface
    this.selected = null;

    // fonts is our raw data
    this.fonts = null;

    this.handlers = {

      toggleGroup(e) {
        let groupName = e.currentTarget.parentNode.dataset.groupName;
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
        
        if (typeface) {
          const state = !typeface.isSelected;
          that.toggleSelect(typeface, state);
        }
        else {
          // unknown situation, just remove selection
          e.currentTarget.classList.remove("--selected");
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

        let fonts = tryParseJSON(result);
        if (fonts === null) return reject();
        
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
   * Applies the currently selected typeface to the current layer via communicating with host
   * Does nothing if selection is null.
   */
  async applySelectedTypeface() {
    const that = this;
    const result = await new Promise((resolve, reject) => {

      if (that.selected === null) return reject();

      // right now just grab the first
      const postScriptName = this.selected.defaultVariant;

      csInterface.evalScript(`applyTypefaceByPostScriptName("${postScriptName}")`, (result) => {
        let response = tryParseJSON(result)
        resolve(response);
      });
    });

    return result;
  }

  /**
   * Toggles a typeface's isSelected state and affects the `.actions` bar
   * @param {TypeFace} typeface 
   */
  toggleSelect(typeface, state = false) {

    const selectedClassName = "--selected";

    // clear previous selection
    if (state && this.selected !== null && this.selected !== typeface) {
      this.selected.isSelected = false;
      document.querySelectorAll(`.${selectedClassName}`).forEach(el => el.classList.remove(selectedClassName));
    }

    // set the typeface
    typeface.isSelected = state;
    this.selected = state ? typeface : null;
    
    // propagate all changes to all elements
    document.querySelectorAll(`.font[data-family="${typeface.family}"]`).forEach(el => el.classList.toggle(selectedClassName, state));

    // toggle the visual state of the actions bar
    Array.from(document.querySelectorAll(".actions__selection-actions .action")).forEach(el => el.classList.toggle("--disabled", !state));

    // update the tray
    this.tray.setScope(this.selected);
    if (state) {
      this.tray.open();
    }
    else {
      this.tray.close();
    }
    
  }

  /**
   * 
   * @param {string} groupName
   * @param {TypeFace} typeface 
   */
  toggleTypefaceInGroup(typeface, groupName) {

    if (typeface === null) return false;

    const group = this.customGroups.find(g =>  g.name === groupName);

    if (group) {
      const toggle = group.typefaces.has(typeface);
  
      if (toggle) {
        group.typefaces.remove(typeface);
      }
      else {
        group.typefaces.add(typeface);
      }
  
      this.renderGroup(group);
      return toggle;
    }

    return false;
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
    
    // this.typefaces.toList().slice(0, 4).forEach(t => group.typefaces.add(t)); // TESTING

    this.customGroups.push(group);
    this.tray.update(this.customGroups);

    this.render();
  }

  deleteGroup(name) {

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

    document.body.querySelectorAll(".group .group__title").forEach( el => {
      el.removeEventListener("click", that.handlers.toggleGroup, options);
      el.addEventListener("click", that.handlers.toggleGroup, options);
    });

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
      <article data-group-name="${group.name}" class="group ${isActive}">
        <h2 class="group__title">${group.name}</h2>
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

  renderGroup(group) {

    const $previous = document.querySelector(`.group[data-group-name="${group.name}"]`)

    $previous.outerHTML = this.getCustomGroupHTML(group, group.typefaces.toList(), this.text);
    this.refreshEventListeners();
  }

}