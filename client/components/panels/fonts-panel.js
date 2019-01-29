
/**
 * [HELPER] Returns the rendered HTML of a list of typefaces.
 * @param {TypeFace[]} typefaces
 * @param {string} text
 */
const getListHTML = (typefaces = [], text) => {
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

    return (`
        <li class="empty">This group is empty.</li>`
    );
  }
}

/**
 * 
 */
class FontsPanel extends Panel {
  
  constructor(parent) {
    super();

    this.parent = parent;

    this.text = "AaBbCc";
    this.defaultText = "AaBbCc";

    const panelClassName = ".fonts-panel";
    const listClassName = ".fonts__list";

    let $root = document.querySelector(panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(listClassName);
  }

  clear() {
    this.render(null);
  }

  viewContents(event) {
    const groupID = event.detail.groupID;
    const selectedGroup = this.parent.customGroups.find(g => g.name === groupID);

    if (selectedGroup) {
      this.render(selectedGroup);
    }
  }

  getHTML(group) {
    if (group) {
      return getListHTML(group.typefaces, this.text);
    }
    else {
      return "No group selected.";
    }

  }

  render(group = null) {
    this.$list.innerHTML = this.getHTML(group);
  }

}