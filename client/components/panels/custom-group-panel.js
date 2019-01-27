
/**
 * 
 * 
 */
class CustomGroupPanel extends Panel {
  
  constructor(parent, groups = []) {
    super();

    const panelClassName = ".groups-panel";
    const listClassName = ".groups__list";

    this.parent = parent;
    this.selected = null;
    this.groups = groups;

    const $root = document.querySelector(panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(listClassName);

  }

  update(groups) {
    this.groups = groups;
    this.render();
  }

  select() {

  }

  unselect() {

  }

  render() {
    this.$list.innerHTML = this.groups.reduce((html, group) => html + this.renderGroup(group), "");
  }
  
  renderGroup(group) {
    // const entries = this.getListHTML(typefaces, text, group.name);
    const isActive = group.isActive ? "--active" : "";
  
    return (`
      <li data-group-name="${group.name}" class="group ${isActive}">
        <div class="group__delete"><i class="material-icons">delete_forever</i></div>
        <h2 class="group__title">${group.name}</h2>
      </li>
    `);
  }

  addTypefaceToGroup() {

  }
}