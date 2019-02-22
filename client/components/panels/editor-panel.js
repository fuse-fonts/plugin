
/**
 * 
 */
class EditorPanel extends Panel {

  constructor(parent) {
    super();
    this.parent = parent;
    console.log(this);
    this.group = null

    this.editor = new GroupEditor();

    this.$root = document.querySelector(".group-editor");
    this.$editor = this.$root.querySelector(".group-editor__editor");
    this.$text = this.$root.querySelector(".group-editor__title");
    this.$icon = this.$root.querySelector(".group-editor__icon");

    this.toggleEditor(false);
    this.$text.addEventListener("click", e => this.edit())
  }

  toggleEditor(value = false) {

    this.$text.style.display = value ? "none" : null;
    this.$editor.style.display = value ? null : "none";
  }



  edit(e) {

    const that = this;
    const { group } = this;

    if (!group || group.permanent) return;
    
    this.dispatchEvent(new CustomEvent(EditorPanel.EDIT));

    this.toggleEditor(true);

    this.editor.edit(this.$editor)
      .then((newValue) => {
        
        that.toggleEditor(false);

        if (this.parent.hasGroup(newValue)) return;

        group.name = newValue;


        that.render();

        this.dispatchEvent(new CustomEvent(EditorPanel.CHANGE, { detail: group.name }));
      })
      .catch(e => {
        that.toggleEditor(false);
      })
  }

  setContext(group) {
    this.group = group;
    this.render();
  }

  clearContext() {
    this.group = null;
    this.render();
  }

  render() {
    if (this.group) {
      this.$root.classList.remove("--hidden")
      this.$text.innerText = this.group.name;
      this.$editor.value = this.group.name;
    }
    else {
      this.$text.innerText = "";
      this.$root.classList.add("--hidden");
    }
  }

}

EditorPanel.EDIT = "edit";
EditorPanel.CHANGE = "change";