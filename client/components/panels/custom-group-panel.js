
/**
 * 
 * 
 */
class CustomGroupPanel extends Panel {
  
  get panelClassName() { return ".groups-panel" }
  get listClassName() { return ".groups__list" }
  get selectedClassName() { return "--selected" }

  get events() {
    return ["SELECT", "UNSELECT", "ADD", "REMOVE"];
  }

  constructor(parent, groups = []) {
    super();
    this.parent = parent;
    this.selected = null;
    this.selectedNode = null;
    this.groups = groups;
    this.context = [];

    const $root = document.querySelector(this.panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(this.listClassName);

    this.addEventListeners();
    console.log(this);
  }

  deleteGroup(groups) {
    if (this.selectedNode) {
      
      const that = this;
      const node = this.selectedNode;
      node.style.position - "relative";
      node.style.backgroundColor = "var(--error-color)";
      node.style.overflow = "hidden";
      node.style.transformOrigin = "left center";

      const keyframes = [
        { transform: "scale(1)", opacity: "1", },
        { transform: "scale(0)", opacity: "0", },
      ];
  
      const options = {
        duration: 260,
        delay: 240,
        easing: "ease-out",
      };
  
      var animation = node.animate(keyframes, options);
  
      this.unselect();
      this.groups = groups;
  
      animation.onfinish = () => node.remove();
  
      return animation;
    }
    else {
      this.update(groups);
    }
  }

  update(groups) {
    this.groups = groups;
    this.render();
  }

  addEventListeners() {
    
    const that = this;

    this.$list.addEventListener("click", e => {

      // ignore clicks withing group actions region
      const isAnAction = e.target.closest(".group__actions") !== null;
      if (isAnAction) return;


      const li = e.target.closest(".group");
      if (li === null) return;
      
      var groupID = li.dataset.groupName;

      var isActive = li.classList.toggle(that.selectedClassName)
      
      if (isActive) this.select(groupID, li);
      else this.unselect(groupID, li);
    })
  }

  select(groupID, node) {
    
    // unselect previous
    if (this.selectedNode) this.unselect();

    this.selected = groupID;
    this.selectedNode = node;

    const detail = { groupID, node };
    const event = new CustomEvent(CustomGroupPanel.SELECT, { detail });

    this.dispatchEvent(event);
  }

  selectByName(name) {
    this.unselect();
    let li = Array.from(this.$list.children).find(li => li.dataset.groupName);
    if (li) {
      this.select(name, li);
    }
  }

  unselect() {
    if (this.selectedNode) this.selectedNode.classList.remove(this.selectedClassName);
    
    const detail = { groupID: this.selected };
    const event = new CustomEvent(CustomGroupPanel.UNSELECT, { detail });
    
    this.dispatchEvent(event);

    this.selected = null;
    this.selectedNode = null;
    this.context = [];
  }

  setContext(families) {
    this.context = families ? families : [];
    this.render();
  }

  refreshEventListeners() {
    
    const options = {};
    const that = this;

    this.$list
      .querySelectorAll(".group__actions button")
      .forEach(node => {

        const li = node.closest(".group");
        const detail = li.dataset.groupName;
        const eventType = node.classList.contains("add") ? CustomGroupPanel.ADD : CustomGroupPanel.REMOVE
        const addEvent = new CustomEvent(eventType, { detail, });

        node.addEventListener("click", (e) => {
          e.stopPropagation();
          if (that.dispatchEvent(addEvent)) {
            that.render();
          }
        });
    })
  }

  render() {
    const groups = [this.parent.allFontsGroup, ...this.groups];
    this.$list.innerHTML = groups.reduce((html, group) => html + this.renderGroup(group), "");

    // re-apply our selected node
    if (this.selectedNode !== null) {
      this.selectedNode = this.$list.querySelector(`.${this.selectedClassName}`);
    }

    this.refreshEventListeners();
  }
  
  renderGroup(group) {
    const isActive = this.selected === group.name ? this.selectedClassName : "";
  
    const hasSelection = this.context.length !== 0;
    const displayActions = hasSelection && !group.permanent;
    let containsTypeface = false;
    let hasMultiple = false;

    if (hasSelection) {

      containsTypeface = this.context.find(t => group.typefaces.includes(t));
      hasMultiple = this.context.length > 1;
    }


    let className = containsTypeface ? "remove" : "add";
    let icon = containsTypeface ? "check" : "check";

    // if (hasMultiple) {
    //   icon = containsTypeface ? "clear_all" : "done_all";
    // }

    const actionsHTML = (`
      <section class="group__actions">
        <button class="${className}"><i class="material-icons">${icon}</i></button>
      </section>
    `);
    
    const fontsCount = (`
      <span class="group__items-count">${group.typefaces.toList().length} typefaces</span>
    `);

    return (`
      <li data-group-name="${group.name}" class="group ${isActive}">
      <h2 class="group__title">${group.name}</h2>
      ${displayActions ? actionsHTML : ""}
      </li>
    `);
  }

}

// event enum
CustomGroupPanel.SELECT = "select";
CustomGroupPanel.UNSELECT = "unselect";
CustomGroupPanel.ADD = "add";
CustomGroupPanel.REMOVE = "remove";