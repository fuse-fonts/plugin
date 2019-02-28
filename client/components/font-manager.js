/**
 * Helper for attempting to parse a JSON response from the host
 * @param {string} input The JSON string result returned from the host script.
 */
window.resultsLog = {};
const tryParseJSON = (input) => {

  // we also log results
  const logTimeKey = new Date().toLocaleString();
  resultsLog[logTimeKey] = input;

  // console.log("Logged a result into %cresultsLog", "color: #06a; font-family: monospace;");

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


class FontManager {

  constructor(csInterface) {

    let that = this;
    this.cs = csInterface;

    // typefaces is the family-grouping of fonts
    this.typefaces = new TypeFaceLibrary();
    this.customGroups = [];

    const fontPanel = new FontsPanel(that);
    const editorPanel = new EditorPanel(that);
    const groupPanel = new CustomGroupPanel(that);
    const actionsPanel = new ActionsPanel(that);
    const selectionPanel = new SelectionPanel(that, fontPanel);
    const separator = new Separator(that);

    this.panels = {
      groups: groupPanel,
      editor: editorPanel,
      fonts: fontPanel,
      actions: actionsPanel,
      selection: selectionPanel,
      separator,
      
    }
    
    // this.editor = new GroupEditor();

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

  /**
   * Provides the glue of event corrospondences between the various panels
   */
  addPanelListeners() {

    const debugEvents = false;

    const that = this;
    const [fontPanel, groupPanel, actionsPanel, selectionPanel, editorPanel] = [
      this.panels.fonts, 
      this.panels.groups, 
      this.panels.actions, 
      this.panels.selection,
      this.panels.editor
    ];

    let timeoutID = null;

    // when a group is selected, load it's fonts and set the editor panel title
    groupPanel.addEventListener(CustomGroupPanel.SELECT, (e) => {

      if (debugEvents) console.log("CustomGroupPanel.SELECT");

      const selectedGroup = that.getGroup(e.detail.groupID);
      if (selectedGroup) {

        fontPanel.loading(true);
        editorPanel.setContext(selectedGroup);

        if (timeoutID !== null) window.clearTimeout(timeoutID);

        timeoutID = window.setTimeout(() => {
          timeoutID = null;
          fontPanel.viewContents.call(fontPanel, selectedGroup);
          // don't allow them to delete "all fonts" — lol nerds
          actionsPanel.hasSelection = selectedGroup.permanent ? false : true;
        }, 200);
      }
      else {
        actionsPanel.hasSelection = false;
      }
    });

    // when a group is unselected, clear out the fonts panel, actions panel, and editor panel
    groupPanel.addEventListener(CustomGroupPanel.UNSELECT, (e) => {
      if (debugEvents) console.log("CustomGroupPanel.UNSELECT");
      editorPanel.clearContext();
      fontPanel.clear();
      actionsPanel.hasSelection = false;
    });

    // When a group was chosen while there are selections in the fonts panel, add the selected fonts to that group
    groupPanel.addEventListener(CustomGroupPanel.ADD, (e) => {
      if (debugEvents) console.log("CustomGroupPanel.ADD");
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

    // helper, used in multiple locations
    const removeFontsFromGroup = group => {
      const fonts = fontPanel.selected;

      this.removeTypefacesFromGroup(fonts, group);

      // re-render the font panel if it was the group affected
      if (fontPanel.group && group.name === fontPanel.group.name) {
        fontPanel.viewContents(fontPanel.group);
      }

      return false;
    }

    // When a group was UNCHOSEN while there are selections in the fonts panel, REMOVe the selected fonts from that group
    groupPanel.addEventListener(CustomGroupPanel.REMOVE, (e) => {
      if (debugEvents) console.log("CustomGroupPanel.REMOVE");

      const groupName = e.detail;
      removeFontsFromGroup(this.getGroup(groupName));
      
      // if we've removed from our currently selected group, then we need to make it happen and lose context
      if (groupName === groupPanel.selected) {
        fontPanel.unselectAll(true);
      }

      return true;
    });

    groupPanel.addEventListener(CustomGroupPanel.EDIT, (e) => {
      if (debugEvents) console.log("CustomGroupPanel.EDIT");
      const group = e.detail;
      editorPanel.edit();
    });

    // When fonts have been removed via the selection panel, _really_ remove them from the current group
    selectionPanel.addEventListener(SelectionPanel.REMOVE, e => {
      if (debugEvents) console.log("SelectionPanel.REMOVE");
      removeFontsFromGroup(fontPanel.group);
    });

    // when a new group is created, selected it and set us in edit mode
    actionsPanel.addEventListener(ActionsPanel.CREATE, e => {
      if (debugEvents) console.log("ActionsPanel.CREATE");
      const group = e.detail;
      groupPanel.selectByName(group.name);
      editorPanel.edit();
    });

    // when the selection in the fonts panel have changed, trugger the group panel to re-render
    fontPanel.addEventListener(FontsPanel.CHANGE, (e) => {
      if (debugEvents) console.log("FontsPanel.CHANGE");

      groupPanel.setContext(e.detail);
    });

    // when all items are unselected in the fonts panel, re-render the groups panel without any context
    fontPanel.addEventListener(FontsPanel.UNSELECT, (e) => {
      if (debugEvents) console.log("FontsPanel.UNSELECT");

      groupPanel.clearContext();
      groupPanel.render();
    });

    // high level: editing a group name will unselect all selected fonts
    editorPanel.addEventListener(EditorPanel.EDIT, e => {
      if (debugEvents) console.log("EditorPanel.EDIT");
      
      fontPanel.unselectAll(true)
    });

    // when renaming the group should re-render the group section
    editorPanel.addEventListener(EditorPanel.CHANGE, e => {
      if (debugEvents) console.log("EditorPanel.CHANGE");

      groupPanel.selected = e.detail; // update with the new name
      groupPanel.render();
      that.save();
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

    const jsonData = JSON.stringify(data);
    
    localStorage.setItem("custom-groups", jsonData);
  }


  async load() {


    const timeStart = performance.now();

    const typefacesJSON = localStorage.getItem("typefaces");

    // populate this.typefaces
    if (typefacesJSON === null) {
      await this.loadTypefaces();

      const timeEnd = performance.now();
      const timeRead = ((timeEnd - timeStart) / 1000).toFixed(2);
      this.notify(`Loaded ${this.typefaces.toList().length} fonts in ${timeRead}s`, 6000)
    }
    else {
      let typefaces = tryParseJSON(typefacesJSON);
      typefaces.forEach(typeface => this.typefaces.add(typeface));

      const timeEnd = performance.now();
      const timeRead = ((timeEnd - timeStart) / 1000).toFixed(2);
      this.notify(`Loaded ${this.typefaces.toList().length} fonts from cache in ${timeRead}s`, 6000)
    }

    // populate custom groups
    const customGroupJSON = localStorage.getItem("custom-groups");

    if (customGroupJSON !== null) {
      
      let customGroups = tryParseJSON(customGroupJSON);

      if (customGroups == null) return;

      this.customGroups = customGroups.map(d => {
        let group = new CustomGroup(d.name);
  
        this.typefaces.toList()
          .filter(t => d.typefaces.includes(t.family)) // get all typefaces referenced
          .reduce((lib, t) => (lib.add(t), lib), group.typefaces);
  
        return group;
      });

      this.panels.groups.update(this.customGroups)
    }



    return new Promise(resolve => resolve());
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

  setLoadingMessage(message) {
    const p = document.querySelector(".loading .messages p")
    const lastMessage = p.innerText;
    p.innerText = message;
    return lastMessage;
  }

  loading(value = true) {
    const { body } = document;

    if (value) {
      body.classList.add("--loading");
      return;
    }
    
    const target = document.querySelector(".loading");
    body.style.overflowY = "hidden";
    let keyframes = [{ opacity: "1", }, { opacity: "0", }, ];
    const options = { delay: 200, duration: 400, easing: "ease-in", }
    const animation = target.animate(keyframes, options);
    animation.onfinish = () => {
      body.classList.remove("--loading");
    }

  }

  menuItemClicked(e) {
    console.log(e);

    const supportURL = "https://meow.coffee";

    const { data } =  e;
    switch (data.menuId) {
      case "feedback":
        this.cs.openURLInDefaultBrowser(supportURL);
        break;
      case "delete-data":
        this.clearData();
        break;
      case "refresh-fonts":
        this.refreshFonts();
        break;
    }
  }

  clearData() {
    if (window.confirm("Delete all custom groups? This is irreversible and permenant.")) {

      this.panels.fonts.unselectAll();
      this.customGroups = [];
      this.panels.editor.clearContext();
      this.panels.groups.update(this.customGroups);

      this.save();
      this.render();
    }
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

  refreshFonts() {
    this.loading(true)
    this.loadTypefaces().then(() => window.setTimeout(() => this.loading(false), 1000));
  }

  loadTypefaces() {
    
    this.typefaces = new TypeFaceLibrary();

    return new Promise((resolve, reject) => {
      csInterface.evalScript("getFontList()", (result) => {

        let fonts = tryParseJSON(result);
        if (fonts === null) return reject();
        
        localStorage.setItem("fonts", result);
        
        this.update(fonts);
        resolve();
      });
    });
  }

  saveAllFonts() {
    
    const fiveYears = 60 * 60 * 24 * 365;0
    let data = JSON.stringify(this.typefaces.toList());
    localStorage.setItem("typefaces", data);
  }

  /**
   * 
   * @param {[TextFont]} fonts
   */
  update(fonts) {

    this.fonts = fonts;
    fonts.forEach((font) => this.typefaces.from(font));
    this.saveAllFonts();
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

    this.customGroups.push(group);
    
    this.panels.groups.update(this.customGroups);

    this.save();
    return group;
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
     * Applies the currently selected typeface to the current layer via communicating with host	
     * Does nothing if selection is null.	
     */
  async applySelectedTypeface(typefaceName = "") {
    const that = this;
    const result = await new Promise((resolve, reject) => {

      if (!typefaceName) return reject();

      if (!this.typefaces.includes(typefaceName)) return reject();

      const typeface = this.typefaces[typefaceName];

      // right now just grab the first	
      const postScriptName = typeface.defaultVariant;

      csInterface.evalScript(`applyTypefaceByPostScriptName("${postScriptName}")`, (result) => {
        let response = tryParseJSON(result)
        resolve(response);
      });
    });
    if (!result.result) this.notify(result.message, 5000);
    return result;
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