
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
  else return "";
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


/**
 * 
 */
class FontsPanel extends Panel {
  
  constructor(parent) {
    super();

    this.parent = parent;

    this.filterText = "";
    this.text = "AaBbCc";
    this.defaultText = "AaBbCc";

    this._selected = []; // private
    this.selectedNodes = [];

    const panelClassName = ".fonts-panel";
    const listClassName = ".fonts__list";
    this.selectedClassName = "--selected";
    this.suppressChangeEvent = false;

    let $root = document.querySelector(panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(listClassName);

    // inputs
    this.$inputs = $root.querySelector(".fonts__inputs");
    this.$filter = $root.querySelector(".fonts__filter");
    this.$preview = $root.querySelector(".fonts__text");
    this.$clearFilter = $root.querySelector(".fonts__clear-filter");
    this.$filterIcon = $root.querySelector(".filter-icon");

    // editor
    this.$groupName = $root.querySelector(".group-editor .group-editor__name");
    this.$editor = $root.querySelector(".group-editor .group-editor__editor");
    
    // panel loading
    this.$loading = $root.querySelector(".loading-section");
    
    this.group = null;
    
    this.nodeClicked = this.nodeClicked.bind(this);
    
    const debouncedFilter = debounce(this.filterKeyUp.bind(this), 60);
    this.$filter.addEventListener("keyup", e => debouncedFilter(e));
    
    const debouncedPreview = debounce(this.previewKeyUp.bind(this), 120);
    this.$preview.addEventListener("keyup", e => debouncedPreview(e));

    this.$clearFilter.addEventListener("click", e => this.clearFilter())
  }

  get events() {
    return ["CHANGE", "SELECT", "UNSELECT"];
  }

  get selected() {
    return this._selected;
  }

  set selected(value = []) {

    const willTriggerUnselectEvent = value.length !== 0;

    if (willTriggerUnselectEvent && !this.suppressChangeEvent) {
      const detail = value;
      this.dispatchEvent(new CustomEvent(FontsPanel.CHANGE, { detail, }));
    }

    this._selected = value;
  }

  clear(dispatchEvents = false) {
    this.suppressChangeEvent = true;
    this.unselectAll();
    this.group = null;
    this.render(null);
    this.suppressChangeEvent = false;
  }

  viewContents(group) {
    
    this.unselectAll()
    this.group = group;
    this.selected = [];
    this.render(group);

    if (this.filterText.length > 0) {
      this.filter(this.filterText);
    }

    this.loading(false);
  }

  addEventListeners() {

    const options = { capture: true, passive: true, };

    Array
      .from(this.$list.children)
      .forEach(node => node.addEventListener("click", e => this.nodeClicked(e), options));


  }

  getNodeRange(startNode, endNode) {
    let nodes = Array.from(this.$list.children)
      .filter(node => node.style.display !== "none"); // only get visible nodes

    let start = nodes.indexOf(startNode)
    let end = nodes.indexOf(endNode);

    if (end < start) {
      [start, end] = [end, start];
    }

    return nodes.slice(start, end + 1);
  }


  // the logic is a bit dense here
  // the key is watching `nodes`, as it contains what will be selected or unselected
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
      }
    }

    const toggle = node.classList.toggle(this.selectedClassName);

    // add to our list of nodes when holding ctrl
    if (e.ctrlKey && toggle && this.selected.length > 0) {
      nodes = mergeUnique(nodes, this.selectedNodes);
    }
    

    if (toggle) this.select(nodes);
    else this.unselect(nodes);

  }

  filterKeyUp(e) {
    const text = this.$filter.value;
    this.filter(text.toLowerCase());
  }

  previewKeyUp(e) {
    let value = this.$preview.value.trim();

    this.text = value;

    if (this.text.length === 0) {
      this.text = this.defaultText;
    }

    this.render(this.group);
  }

  filter(text) {
    
    this.filterText = text;

    if (this.filterText.length > 0) {
      this.$clearFilter.style.display = null;
      this.$filterIcon.classList.add("--active")
    }
    else {
      this.$clearFilter.style.display = "none";
      this.$filterIcon.classList.remove("--active")
    }

    Array
      .from(this.$list.children)
      .forEach(node => {
        const family = node.dataset.family;
        node.style.display = family.toLowerCase().includes(text) ? null : "none";
      });
  }

  clearFilter() {
    this.$filter.value = "";
    this.filter("");
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
      return (``);
    }

  }

  loading(toggle = true) {
    this.$root.classList.toggle("--loading", toggle);
  }

  render(group = null) {
    this.$list.innerHTML = this.getHTML(group);
    this.$inputs.classList.toggle("--disabled", group === null);
    this.$root.classList.toggle("--has-selection", group !== null);
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