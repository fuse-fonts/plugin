class CustomGroup {

  constructor(name) {
    this.name = name;
    this.typefaces = new TypeFaceLibrary();
    this.isActive = true;
  }

  updateTypeFaces(typefaces) {
    this.typefaces = typefaces;
  }

  saveChanges() {
    // todo
    // persist
  }
}

class CustomGroupTray {

  constructor(parent, $tray, groups = []) {
    this.parent = parent;
    this.groups = groups;
    this.typeface = null;
    this.activeItemClassName = "--active";
    this.activeTrayClassName = "--open";
    this.$tray = $tray;
    this.$list = $tray.querySelector("ul");

    const that = this;
    this.$list.addEventListener("click", (e) => {
      that.parent.toggleTypefaceInGroup(that.typeface, e.target.innerText);
      that.render();
    });
  }

  

  /**
   * Visually shows the tray.
   */
  open() {
    this.$tray.classList.add(this.activeTrayClassName);
  }

  /**
  * Visually hides the tray.
  */
  close() {
    this.$tray.classList.remove(this.activeTrayClassName);
  }

  toggle() {
    this.$tray.classList.toggle(this.activeTrayClassName);
  }

  update(groups) {
    this.groups = groups;
    this.render();
  }

  setScope(typeface) {
    this.typeface = typeface;
    this.applyScope();
  }

  applyScope() {
    const { activeItemClassName, typeface } = this;

    const $items = Array.from(this.$list.querySelectorAll("li"))
    if (typeface === null) {
      $items.forEach(li => li.classList.remove(activeItemClassName));
    }
    else {
      const groupsWithinScope = this.groups.filter(g => g.typefaces.has(typeface)).map(g => g.name)
  
      $items.forEach(li => {
        const isActive = groupsWithinScope.includes(li.innerText);
        li.classList.toggle(activeItemClassName, isActive);
      });
    }
  }

  render() {
    const { typeface, activeItemClassName, groups } = this;

    this.$list.innerHTML = groups.reduce((html, group) => {
      
      const isWithinScope = group.typefaces.has(typeface);
      let isActive = isWithinScope ? activeItemClassName : "";
      const template = (`<li class="${isActive}">${group.name}</li>`);
      return html + template;
    }, "");
  }
}