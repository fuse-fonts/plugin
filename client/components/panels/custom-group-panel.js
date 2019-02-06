
/**
 * 
 * 
 */
class CustomGroupPanel extends Panel {
  
  get panelClassName() { return ".groups-panel" }
  get listClassName() { return ".groups__list" }
  get selectedClassName() { return "--selected" }
  get actionsClassName() { return "--allow-actions" }

  get events() {
    return ["SELECT", "UNSELECT", "ADD", "REMOVE"];
  }

  constructor(parent, groups = []) {
    super();
    this.parent = parent;
    this.selected = null;
    this.selectedNode = null;
    this.groups = groups;
    this.context = null;

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

      const keyframes = [
        { height: `${node.offsetHeight}px`, overflow: "hidden", transform: "scale(1)", },
        { height: "0px", overflow: "hidden", transform: "scale(0)" },
      ];
  
      const options = {
        duration: 400,
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

  unselect() {
    if (this.selectedNode) this.selectedNode.classList.remove(this.selectedClassName);
    this.hideFontActions();
    
    const detail = { groupID: this.selected };
    const event = new CustomEvent(CustomGroupPanel.UNSELECT, { detail });
    
    this.dispatchEvent(event);

    this.selected = null;
    this.selectedNode = null;
  }

  displayFontActions() {
    this.$list.classList.add(this.actionsClassName);
  }

  hideFontActions() {
    this.$list.classList.remove(this.actionsClassName);
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
          that.dispatchEvent(addEvent);
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
  
    const actionsHTML = (`
      <section class="group__actions">
        <button class="add"><i class="material-icons">add</i></button>
        <!--<button><i class="material-icons">remove_from_queue</i></button>-->
      </section>
    `)
    
    return (`
      <li data-group-name="${group.name}" class="group ${isActive}">
        <h2 class="group__title">${group.name}</h2>
        ${group.permanent ? "" : actionsHTML}
      </li>
    `);
  }

}

// event enum
CustomGroupPanel.SELECT = "select";
CustomGroupPanel.UNSELECT = "unselect";
CustomGroupPanel.ADD = "add";
CustomGroupPanel.REMOVE = "remove";