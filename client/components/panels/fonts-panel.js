
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
              <div class="font__styles"></div>
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

    this.selected = [];
    this.selectedNodes = [];

    const panelClassName = ".fonts-panel";
    const listClassName = ".fonts__list";
    this.selectedClassName = "--selected";

    let $root = document.querySelector(panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(listClassName);


    this.nodeClicked = this.nodeClicked.bind(this);
  }

  clear() {
    this.render(null);
  }

  viewContents(group) {
    this.render(group);
  }

  addEventListeners() {

    const options = { capture: true, passive: true, };

    Array
      .from(this.$list.children)
      .forEach(node => node.addEventListener("click", e => this.nodeClicked(e), options));


  }

  getNodeRange(startNode, endNode) {
    let nodes = Array.from(this.$list.children);

    let start = nodes.indexOf(startNode)
    let end = nodes.indexOf(endNode);

    if (end < start) {
      [start, end] = [end, start];
    }

    return nodes.slice(start, end + 1);
  }

  nodeClicked(e) {
    const node = e.currentTarget;
    let nodes = [node];
    // console.log("clicked", node, e)

    if (this.selected.length > 0) {

      const shouldClearSelection = !(e.shiftKey || e.ctrlKey);
      const previousNode = this.selectedNodes[0];
      const selectedPreviousNode = node.isSameNode(previousNode);

      if (shouldClearSelection) {

        this.unselectAll(true);
        if (selectedPreviousNode) return;
      }
      else {
        if (e.shiftKey) {
          this.selectRange(previousNode, node);
          return;
        }
        if (e.ctrlKey) {
          nodes = nodes.concat(this.selectedNodes);
        }
      }
    }

    const toggle = node.classList.toggle(this.selectedClassName);
    if (toggle) this.select(nodes);
    else this.unselect(nodes);

  }

  selectRange(previousNode, node) {
    const nodes = this.getNodeRange(previousNode, node);
    nodes.forEach(n => n.classList.add(this.selectedClassName));
    this.select(nodes);
  }

  select(nodes = []) {
    const shouldTriggerEvent = this.selected.length === 0;
    this.selectedNodes = nodes;
    this.selected = this.selectedNodes.map(node => node.dataset.family);
    console.log("selected:", this.selected)

    if (shouldTriggerEvent) {
      const fonts = this.selected;
      const detail = { fonts, nodes, };
      const event = new CustomEvent(FontsPanel.SELECT, { detail });

      this.dispatchEvent(event);
    }
  }

  unselectAll() {
    const fonts = [];
    const nodes = this.selectedNodes.map(node => node.classList.remove(this.selectedClassName));

    this.selectedNodes = [];
    this.selected = [];

  }

  unselect(nodes = []) {
    
    const groups = this.selectedNodes.reduce((p, node) => {
      if (nodes.contains(node)) p.unselected.push(node);
      else p.selected.push(node);
      return p;
    }, {
      selected: [],
      unselected: [],
    })

    groups.unselected.forEach(n => n.classList.remove(this.selectedClassName));

    this.selectedNodes = groups.selected;
    this.selected = groups.selected.map(n => n.dataset.family);

    // event triggered only when no items are currently selected
    if (this.selected.length === 0) {
      const fonts = groups.unselected.map(n => n.dataset.family);
      const detail = { fonts, nodes: group.unselected };
      const event = new CustomEvent(FontsPanel.UNSELECT, { detail });
  
      this.dispatchEvent(event);
    }

  }

  getHTML(group) {
    if (group) {
      return getListHTML(group.typefaces.toList(), this.text);
    }
    else {
      return "No group selected.";
    }

  }

  render(group = null) {
    this.$list.innerHTML = this.getHTML(group);
    this.addEventListeners();
  }

}

// event enum
FontsPanel.SELECT = "select";
FontsPanel.UNSELECT = "unselect";