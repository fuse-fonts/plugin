
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

  render() {

  }

  addTypefaceToGroup() {

  }
}