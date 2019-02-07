
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

    this._selected = []; // private
    this.selectedNodes = [];

    const panelClassName = ".fonts-panel";
    const listClassName = ".fonts__list";
    this.selectedClassName = "--selected";

    let $root = document.querySelector(panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(listClassName);

    // inputs
    this.$inputs = $root.querySelector(".fonts__inputs");
    this.$filter = $root.querySelector(".fonts__filter");
    this.$preview = $root.querySelector(".fonts__text");

    this.group = null;

    this.nodeClicked = this.nodeClicked.bind(this);

  }

  get events() {
    return ["CHANGE", "SELECT", "UNSELECT"];
  }

  get selected() {
    return this._selected;
  }

  set selected(value = []) {

    const detail = value;
    this.dispatchEvent(new CustomEvent(FontsPanel.CHANGE, { detail, }));

    this._selected = value;
  }

  clear() {
    this.group = null;
    this.render(null);
  }

  viewContents(group) {
    this.unselectAll()
    this.group = group;
    this.selected = [];
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

    if (this.selected.length > 0) {

      const shouldClearSelection = !(e.shiftKey || e.ctrlKey);
      const previousNode = this.selectedNodes[0];
      const selectedPreviousNode = node.isSameNode(previousNode);

      if (shouldClearSelection) {

        this.unselectAll(selectedPreviousNode);
        if (selectedPreviousNode) return;
      }
      else {
        if (e.shiftKey) {
          this.selectRange(previousNode, node);
          return;
        }
        if (e.ctrlKey) {
          nodes = mergeUnique(nodes, this.selectedNodes);
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
    this.select(mergeUnique(nodes, this.selectedNodes));
  }

  select(nodes = []) {
    const shouldTriggerEvent = this.selected.length === 0;
    this.selectedNodes = nodes;
    this.selected = this.selectedNodes.map(node => node.dataset.family);

    if (shouldTriggerEvent) {
      const fonts = this.selected;
      const detail = { fonts, nodes, };
      const event = new CustomEvent(FontsPanel.SELECT, { detail });

      this.dispatchEvent(event);
    }
  }

  unselectAll(dispatchEvent = false) {
    const fonts = [];
    const nodes = this.selectedNodes.map(node => node.classList.remove(this.selectedClassName));

    this.selectedNodes = [];
    this.selected = [];

    if (dispatchEvent) {
      // dispatch "unselect" event
      this.dispatchEvent(new CustomEvent(FontsPanel.UNSELECT));
    }
  }

  unselect(nodes = []) {
    
    const groups = this.selectedNodes.reduce((p, node) => {
      if (nodes.includes(node)) p.unselected.push(node);
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
      const event = new CustomEvent(FontsPanel.UNSELECT);
      this.dispatchEvent(event);
    }
  }

  removeSelectedFonts() {
    const group = this.group;
    const fonts = fontPanel.selected;
    this.removeTypefacesFromGroup(fonts, group);

    // re-render the font panel if it was the group affected
    if (fontPanel.group && group.name === fontPanel.group.name) {
      fontPanel.viewContents(fontPanel.group);
    }
  }

  getHTML(group) {
    if (group) {
      return getListHTML(group.typefaces.toList(), this.text);
    }
    else {
      return (`<li class="empty">No group selected.</li>`);
    }

  }

  loading() {
    this.parent.notify("todo: show loading");
  }

  render(group = null) {
    this.$list.innerHTML = this.getHTML(group);
    this.$inputs.classList.toggle("--disabled", group === null);
    this.addEventListeners();
  }



}

// event enum
FontsPanel.CHANGE = "change";
FontsPanel.SELECT = "select";
FontsPanel.UNSELECT = "unselect";

/**
 * [HELPER] Helper for combining two nodelists,
 * @param {Node[]} nodes unaffected list that `otherNodes` will be added to
 * @param {Node[]} otherNodes The list of nodes that will be checked for duplicates
 */
function mergeUnique(nodes, otherNodes) {
  const uniques = otherNodes.filter(node => !nodes.includes(node));
  return nodes.concat(uniques);
}