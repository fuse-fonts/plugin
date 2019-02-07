class ActionsPanel extends Panel {

  constructor(parent) {
    super();
    this.parent = parent;

    this._hasSelection = false;

    this.$root = document.querySelector(".actions-panel");
    this.$groups = document.querySelector(".groups");

    this.disabledClassName = "--disabled";
    this.compactViewClassName = "--compact";

    // button for deleting groups
    this.$delete = this.$root.querySelector(".toggle-group-deletions");

    // button for creating groups
    this.$create = this.$root.querySelector(".create-group");

    // button for list view
    this.$listView = this.$root.querySelector(".view-as-list");

    // button for grid view
    this.$gridView = this.$root.querySelector(".view-as-grid");
    
    // event listeners
    this.$create.addEventListener("click", e => this.createClicked());
    this.$delete.addEventListener("click", e => this.deleteClicked());
    this.$listView.addEventListener("click", e => this.listView());
    this.$gridView.addEventListener("click", e => this.gridView())

  }

  get hasSelection() {
    return this._hasSelection;
  }

  set hasSelection(value) {
    this._hasSelection = value;
    this.$delete.classList.toggle(this.disabledClassName, !value);
  }

  deleteClicked() {
    this.parent.deleteGroup();
  }

  createClicked() {
    this.parent.createGroup();
  }

  listView(){
    this.$listView.classList.add(this.disabledClassName);
    this.$groups.classList.remove(this.compactViewClassName);
    this.$gridView.classList.remove(this.disabledClassName);
  }

  gridView() {
    this.$gridView.classList.add(this.disabledClassName);
    this.$groups.classList.add(this.compactViewClassName);
    this.$listView.classList.remove(this.disabledClassName);
  }

}

ActionsPanel.DELETE = "delete";
ActionsPanel.CREATE = "create";