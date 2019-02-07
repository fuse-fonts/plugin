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

  constructor(csInterface) {

    let that = this;
    this.cs = csInterface;

    // typefaces is the family-grouping of fonts
    this.typefaces = new TypeFaceLibrary();
    this.customGroups = [];

    const fontPanel = new FontsPanel(that);
    const groupPanel = new CustomGroupPanel(that);
    const actionsPanel = new ActionsPanel(that);

    this.panels = {
      groups: groupPanel,
      fonts: fontPanel,
      actions: actionsPanel,
    }
    
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

    this.addPanelListeners();
  }

  addPanelListeners() {

    const that = this;
    const [fontPanel, groupPanel, actionsPanel] = [this.panels.fonts, this.panels.groups, this.panels.actions];

    groupPanel.addEventListener(CustomGroupPanel.SELECT, (e) => {

      const selectedGroup = that.getGroup(e.detail.groupID);

      if (selectedGroup) {
        fontPanel.loading();
        window.setTimeout(() => {
          fontPanel.viewContents(selectedGroup);
          // don't allow them to delete "all fonts" — lol nerds
          actionsPanel.hasSelection = selectedGroup.permanent ? false : true;

        }, 1);
      }
      else {
        actionsPanel.hasSelection = false;
      }
    });

    groupPanel.addEventListener(CustomGroupPanel.UNSELECT, (e) => {
      fontPanel.clear();
      actionsPanel.hasSelection = false;
    });

    groupPanel.addEventListener(CustomGroupPanel.ADD, (e) => {
      const groupName = e.detail;
      const group = this.getGroup(groupName);
      const fonts = fontPanel.selected;

      this.addTypefacesToGroup(fonts, group);

      // re-render the font panel if it was the group affected
      if (fontPanel.group && group.name === fontPanel.group.name) {
        fontPanel.viewContents(fontPanel.group);
      }

      return true;
    });

    groupPanel.addEventListener(CustomGroupPanel.REMOVE, (e) => {
      const groupName = e.detail;
      const group = this.getGroup(groupName);
      const fonts = fontPanel.selected;

      this.removeTypefacesFromGroup(fonts, group);

      // re-render the font panel if it was the group affected
      if (fontPanel.group && group.name === fontPanel.group.name) {
        fontPanel.viewContents(fontPanel.group);
      }
      return true;
    });

    groupPanel.addEventListener(CustomGroupPanel.REMOVE, (e) => {

    })

    fontPanel.addEventListener(FontsPanel.CHANGE, (e) => {
      groupPanel.setContext(e.detail);
    });

    fontPanel.addEventListener(FontsPanel.SELECT, (e) => {
      // groupPanel.setContext(e.detail)
    });

    fontPanel.addEventListener(FontsPanel.UNSELECT, (e) => {
      groupPanel.setContext(null);
    });


  }
  

  getGroup(name) {
    if (name === "All Fonts") return this.allFontsGroup;
    return this.customGroups.find(g => g.name === name) || null;
  }

  get allFontsGroup() {
    const allFonts = new CustomGroup("All Fonts", true);
    allFonts.typefaces = this.typefaces;
    return allFonts;
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
        
        this.panels.groups.update(this.customGroups)
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
    
    this.panels.groups.update(this.customGroups);

    this.save();
  }

  deleteGroup(name = null) {

    if (name === null) {
      // fetch name from currently selected group
      if (this.panels.groups.selected) return this.deleteGroup(this.panels.groups.selected);
      // else it's an invalid group
    }

    this.customGroups = this.customGroups.filter(g => g.name !== name);

    this.panels.groups.deleteGroup(this.customGroups);

    this.notify(`${name} deleted`, 2600);

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

  /**
   * [DEPRACATED] — Keep for editing name reference
   */
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

  addTypefacesToGroup(families = [], customGroup) {

    // get all typefaces from their name
    const typefaces = families.map(family => this.typefaces[family]);

    typefaces.forEach(typeface => customGroup.typefaces.add(typeface));

    this.save();
  }

  removeTypefacesFromGroup(families = [], customGroup) {

    // get all typefaces from their name
    const typefaces = families.map(family => this.typefaces[family]);

    typefaces.forEach(typeface => customGroup.typefaces.remove(typeface));

    this.save();
  }

  /**
   * Renders the current state of all typefaces and custom groups to the DOM, then calls `FontManager.refreshEventListeners`
   */
  render() {

    const that = this;
    const { typefaces, text } = this;

    this.panels.groups.render();
    this.panels.fonts.render(this.panels.groups.selected || null);
    
  }

}