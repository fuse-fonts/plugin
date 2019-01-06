class GroupEditor {

  constructor(parent) {
    this.el = null;
    this.parent = parent;

    // bindings
    this.keydownHandler = this.keydownHandler.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
  }

  get isEditing() {
    return this.el !== null;
  }

  get value() {
    if (this.isEditing) return this.el.innerText.trim();
    return null;
  }

  edit(el) {

    if (this.isEditing) this.end();
    if (el === null) return;

    const that = this;
    this.el = el;
    this.initialValue = this.el.innerText;

    console.log("Editing ", el.innerText)
    el.contentEditable = true;
    el.classList.add("--editing");
    el.focus();
    // if we want to highlight the selection
    // document.execCommand('selectAll',false,null)

    el.addEventListener("blur", this.blurHandler);
    el.addEventListener("keydown", this.keydownHandler);


    this.promise = new Promise((resolve, reject) => this.setExecutor(resolve, reject));
    return this.promise;
  }

  setExecutor(resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  }

  end() {

    const { el, isValid, value, initialValue } = this;

    el.contentEditable = false;
    el.classList.remove("--editing");
    el.blur();

    el.removeEventListener("blur", this.blurHandler);
    el.removeEventListener("keydown", this.keydownHandler);

    if (isValid) {
      this.resolve(value);
    }
    else {
      el.innerText = initialValue;
      this.reject("Invalid text");
    }
    this.el = null;
  }

  keydownHandler(e){
    switch (e.key.toLowerCase()) {
      case "enter":
        e.preventDefault();
      case "escape":
        this.end();
        break;
    }
  }

  blurHandler(e) {
    this.end();
  }

  get isValid() {
    const value = this.value;
    if (value === null) return false;
    if (value.length === 0) return false;
    if (value === this.initialValue) return false;
    return true;
  }
}