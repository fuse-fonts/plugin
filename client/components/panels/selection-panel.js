
class SelectionPanel extends Panel {

  constructor(parent, fontPanel) {
    super();
    this.parent = parent;
    this.fontPanel = fontPanel;
    this.autoApply = true;

    this.$selections = document.querySelector(".selection-panel");
    this.$message = this.$selections.querySelector(".selection-text");
    this.$applyFonts = this.$selections.querySelector(".apply-typeface");
    this.$removeFont = this.$selections.querySelector(".remove");

    
    this.$removeFont.addEventListener("click", e => {
      this.dispatchEvent(new CustomEvent(SelectionPanel.REMOVE));
    });

    this.applyTypefaceClassName = "--active";
    this.$applyFonts.addEventListener("click", e => {
      const detail = this.$applyFonts.classList.toggle(this.applyTypefaceClassName)
      this.dispatchEvent(new CustomEvent(SelectionPanel.AUTOAPPLY, { detail }));

      this.autoApply = detail;
    });

    this.changeHandler = this.changeHandler.bind(this);

    // this panel hooks into the fonts panel
    fontPanel.addEventListener(FontsPanel.CHANGE, this.changeHandler);

    // todo: determine if this is helpful:
    const unselectEvent = new CustomEvent(FontsPanel.CHANGE, { detail: [] });
    fontPanel.addEventListener(FontsPanel.UNSELECT, e => this.changeHandler(unselectEvent));

  }

  applyTypeface(typefaceName) {
    if (this.autoApply) this.parent.applySelectedTypeface(typefaceName);
  }

  changeHandler(e) {
    const value = e.detail;
    
    if (value.length > 0) {
      this.applyTypeface(value[0]);

      let message = "";
      if (value.length > 1) message = `${value.length} typefaces selected`;
      this.$message.innerText = message;

      this.display();
    }
    else this.hide();
  }

  setRemoveFontsAction() {
    // don't allow them to delete fonts from "All Fonts"
    if (this.fontPanel.group) {
      this.$removeFont.classList.toggle("--disabled", this.fontPanel.group.permanent);
    }
    else {
      this.$removeFont.classList.add("--disabled");
    }
  }

  display() {
    this.$selections.classList.add("--active");
    this.setRemoveFontsAction();
  }

  hide() {
    this.$selections.classList.remove("--active");
    this.setRemoveFontsAction();
  }

}

// event enums
SelectionPanel.REMOVE = "remove";
SelectionPanel.AUTOAPPLY = "auto-apply";