
/**
 * 
 * 
 */
class CustomGroupPanel extends Panel {
  
  get panelClassName() { return ".groups-panel" }
  get listClassName() { return ".groups__list" }
  get selectedClassName() { return "--selected" }

  get events() {
    return ["SELECT", "UNSELECT"];
  }

  constructor(parent, groups = []) {
    super();
    this.parent = parent;
    this.selected = null;
    this.selectedNode = null;
    this.groups = groups;

    const $root = document.querySelector(this.panelClassName);
    this.$root = $root;
    this.$list = $root.querySelector(this.listClassName);

    this.addEventListeners();
    console.log(this);
  }

  deleteGroup(groups) {
    if (this.selectedNode) {
      
      const that = this;
  
      const keyframes = [
        { height: `${this.selectedNode.offsetHeight}px`, overflow: "hidden", transform: "scale(1)", },
        { height: "0px", overflow: "hidden", transform: "scale(0)" },
      ];
  
      const options = {
        duration: 400,
        easing: "ease-out",
      };
  
      var animation = this.selectedNode.animate(keyframes, options);
  
      this.unselect();
  
      animation.onfinish = () => this.update(groups);
  
      return animation;
    }
    else {
      this.update(groups);
    }
  }

  update() {
    this.groups = groups;
    this.render();
  }

  addEventListeners() {
    
    const that = this;

    this.$list.addEventListener("click", e => {
      
      var li = e.target.parentNode;
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
    
    const detail = { groupID: this.selected };
    const event = new CustomEvent(CustomGroupPanel.UNSELECT, { detail });
    
    this.dispatchEvent(event);

    this.selected = null;
    this.selectedNode = null;
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

// event enum
CustomGroupPanel.SELECT = "select";
CustomGroupPanel.UNSELECT = "unselect";