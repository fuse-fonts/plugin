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
    this.editor = new GroupEditor();

    // notifications
    this.timeoutID = null; // used for notifications
    this.$notification = document.querySelector(".notification");

    // the selected typeface
    this.selected = null;

    // fonts is our raw data
    this.fonts = null;

    // bind handlers
    for (let key in this.handlers) {
      this.handlers[key] = this.handlers[key].bind(that);
    }

    this.toggleSelectionHandler = this.toggleSelectionHandler.bind(this);
    this.addEventListeners();
  }

  save() {
    let data = this.customGroups.map( g => {
      const { name } = g;
      const typefaces = g.typefaces.toList().map(t => t.family);
      return { name, typefaces };
    });
    const fiveYears = 60 * 60 * 24 * 365;
    const jsonData = `json=${JSON.stringify(data)};max-age=${fiveYears}`;
    document.cookie = jsonData;
  }

  load() {

    let kvp = document.cookie.split(";") || [];
    let jsonKvp = kvp.find(k => k.includes("json="))
    if (kvp.length > 0 && jsonKvp) {
      let jsonData = jsonKvp.split("json=")[1];
      let json = tryParseJSON(jsonData);
      if (json != null) {
        console.log("Successfully loaded from cookie", json);
        this.customGroups = json.map(d => {
          let group = new CustomGroup(d.name);

          
          this.typefaces.toList()
            .filter(t => d.typefaces.includes(t.family)) // get all typefaces referenced in the cookie
            .reduce( (lib, t) => (lib.add(t), lib), group.typefaces);
          
            return group;
        });
        
        fm.tray.update(this.customGroups);
      }
    }
  }

  /**
   * Detect the theme based on the current host environment and applies it.
   * Notes: the host environment returns an sRGB color, which we need to transform into our stylesheets of "dark", "medium", "light", and "bright"
   */
  detectTheme() {

    const red = this.cs.getHostEnvironment().appSkinInfo.panelBackgroundColor.color.red;

    const theme = {
      DARK: "theme--dark",
      MEDIUM: "theme--medium",
      LIGHT: "theme--light",
      BRIGHT: "theme--bright",
    };
    
    // clear theme from before
    document.body.classList.remove(...Object.values(theme));

    if (red <= 50)        document.body.classList.add(theme.DARK);
    else if (red <= 83)   document.body.classList.add(theme.MEDIUM);
    else if (red <= 184)  document.body.classList.add(theme.LIGHT);
    else if (red <= 240)  document.body.classList.add(theme.BRIGHT);
    else                  document.body.classList.add(theme.DARK);
  }

  notify(message = "", duration = 5000) {
    if (this.timeoutID) window.clearTimeout(this.timeoutID);
    this.$notification.innerHTML = `<span>${message}</span>`;
    const msgNode = this.$notification.firstElementChild;
    const ms = duration / 2
    this.timeoutID = window.setTimeout(() => {
      let animation = msgNode.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: "ease-in"});
      animation.onfinish = () => { this.$notification.innerHTML = ""; };
    }, ms);

  }

  getGroupFromTitleNode(node) {
    let groupName = node.parentNode.dataset.groupName;
    return this.customGroups.find(g => g.name === groupName);
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
    if (!result.result) this.notify(result.message, 5000);
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
      this.applySelectedTypeface();
    }
    else {
      this.tray.close();
    }
  }

  unselect() {
    if (this.selected !== null) {
      this.toggleSelect(this.selected, false);
      return true;
    }
    
    return false;
  }

  toggleSelectionHandler(e) {

    const selectedClassName = "--selected";
    const family = e.currentTarget.dataset.family;
    const typeface = this.typefaces[family];

    if (typeface) {
      const state = !typeface.isSelected;
      this.toggleSelect(typeface, state);
    }
    else {
      // unknown situation, just remove selection
      e.currentTarget.classList.remove(selectedClassName);
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
      this.save();
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
  createGroup(name = null) {
    if (name === null) {
      name = CustomGroup.getDefaultName(this.customGroups);
    }
    const group = new CustomGroup(name);
    
    // this.typefaces.toList().slice(0, 4).forEach(t => group.typefaces.add(t)); // TESTING

    this.customGroups.push(group);
    this.tray.update(this.customGroups);

    this.render();
    this.save();
  }

  deleteGroup(name) {
    this.customGroups = this.customGroups.filter(g => g.name !== name);
    this.tray.update(this.customGroups);
    this.notify(`${name} deleted`, 2600);
    this.render();
    this.save();
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

  addEventListeners() {
    
    const that = this;
    const options = { capture: true, passive: true, };

    // toggle all fonts section
    const $allFontsTitle = document.body.querySelector(".all-fonts .group__title")
    $allFontsTitle.addEventListener("click", (e) => {
      e.currentTarget.parentNode.classList.toggle("--active");
    }, options);

    $allFontsTitle.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      return false;
    })
  }

  /**
   * Removes all dynamic event listeners on specific re-rendered nodes, and re-listens to them.
   */
  refreshEventListeners() {
    console.log("refreshing event listeners")
    const that = this;
    const options = { capture: true, passive: true, };

    document.body.querySelectorAll(".group").forEach(this.addGroupEventListeners.bind(this));

    // selecting under the all fonts region
    // child `.font` of groups will be handled by this.addGroupEventListeners
    document.body.querySelectorAll(".all-fonts .font").forEach( el => {
      el.removeEventListener("click", that.toggleSelectionHandler, options);
      el.addEventListener("click", that.toggleSelectionHandler, options);
    });

  }

  addGroupEventListeners(node) {
    
    const that = this;
    const options = { capture: true, passive: true, };

    const $title = node.querySelector(".group__title");
    const group = this.getGroupFromTitleNode($title);

    if (group) {

      // toggle
      $title.addEventListener("click", () => {
        if (group) group.isActive = !group.isActive;
        node.classList.toggle("--active");
      }, options);

      $title.addEventListener("contextmenu", () => {
        that.cs.setContextMenuByJSON(`{ "menu": [{"id": "${group.name}", "label": "Delete '${group.name}'"}]}`, (e) => {
          that.deleteGroup(group.name);
        });
      }, options);
    
      // editing
      $title.addEventListener("dblclick", (e) => {
        
        const selectedTypeface = this.selected;
        const unselected = that.unselect();
  
        that.editor.edit(e.currentTarget)
          .then((newValue) => {
            // sanitize these things
            newValue = newValue.replace(/</gi, "&lt;").replace(/>/gi, "&gt;")
            group.name = newValue;
            node.dataset.groupName = newValue;
            that.tray.render();
            that.save();
          })
          .catch(e => e) // no change
          .then(r => {
            // reselect our typeface like coolguys
            if (unselected) that.toggleSelect(selectedTypeface, true);
          })
      }, options);

      node.querySelector(".group__delete").addEventListener("click", e => this.deleteGroup(group.name));

      node.querySelectorAll(".font").forEach(el => {
        el.addEventListener("click", that.toggleSelectionHandler, options);
      });
    }

  }

  /**
   * Returns the rendered HTML of a custom group.
   * @param {CustomGroup} group 
   * @param {TypeFace[]} typefaces 
   * @param {string} text 
   */
  getCustomGroupHTML(group, typefaces, text) {
    
    const entries = this.getListHTML(typefaces, text, group.name);
    const isActive = group.isActive ? "--active" : "";

    return (`
      <article data-group-name="${group.name}" class="group ${isActive}">
        <div class="group__delete"><i class="material-icons">delete_forever</i></div>
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
  getListHTML(typefaces, text, groupName = null) {
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
      let tip = "";

      // display a tip to the first group they create.
      if (groupName !== null && groupName === "Group 1") {
        tip = `<span class="tip">tip: Double-click '<b>${groupName}</b>' to rename this group.</span>`;
      }

      return (`
        <li class="empty">
          This group is empty.
          ${tip}
        </li>`
      );
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
      $customGroups.innerHTML = `
        <h2 class="no-groups" onclick="fm.createGroup()">
          <span>Add a group to get started:</span>
          <button class="action add-group" title="Create new custom group">
            <i class="material-icons">folder</i>
          </button>
        </h2>`;
    }
    
    //
    // render the "All Fonts" section — not a real category
    //
    const $allFonts = document.querySelector(".all-fonts .font-list__list");

    $allFonts.innerHTML = this.getListHTML(typefaces.toList(), text);

    this.refreshEventListeners();
    fm.tray.render();
  }

  renderGroup(group) {
    const $previous = document.querySelector(`.group[data-group-name="${group.name}"]`)
    $previous.outerHTML = this.getCustomGroupHTML(group, group.typefaces.toList(), this.text);
    const $next = document.querySelector(`.group[data-group-name="${group.name}"]`)
    this.addGroupEventListeners($next)
  }

}