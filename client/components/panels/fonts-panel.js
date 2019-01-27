
/**
 * 
 */
class FontsPanel extends Panel {
  
  constructor(parent) {
    super();

    this.parent = parent;
    const panelClassName = ".fonts-panel";
    const listClassName = ".fonts__list";

    let $root = document.querySelector(panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(listClassName);
  }

  getHTML(group) {
    if (group) {
      return (`
        <li>Group Contents here — todo</li>
      `);
    }
    else {
      return "No group selected.";
    }

  }

  render(group = null) {
    this.$list.innerHTML = this.getHTML(group);
  }

}