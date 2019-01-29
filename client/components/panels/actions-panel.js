class ActionsPanel extends Panel {

  constructor(parent) {
    super();
    this.parent = parent;

    this._hasSelection = false;

    this.$root = document.querySelector(".actions-panel");

    // button for deleting groups
    this.$delete = this.$root.querySelector(".toggle-group-deletions");

    // button for creating groups
    this.$create = this.$root.querySelector(".create-group");

    
    // event listeners
    this.$create.addEventListener("click", e => this.createClicked())
    this.$delete.addEventListener("click", e => this.deleteClicked())
  }

  get hasSelection() {
    return this._hasSelection;
  }

  set hasSelection(value) {
    this._hasSelection = value;
    this.$delete.classList.toggle("--disabled", !value);
  }

  deleteClicked() {
    this.parent.deleteGroup();
  }

  createClicked() {
    console.log("creating a new group")
    this.parent.createGroup();
  }

}

ActionsPanel.DELETE = "delete";
ActionsPanel.CREATE = "create";