const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

class Separator {

  constructor(parent) {
    this.parent = parent;
    this.grooupsPanelClassName = "--groups-panel-size";
    this.$anchor = document.querySelector(".separator");

    this.$html = document.querySelector("html");
    this.$body = document.body;

    this.min = 12;
    this.max = 75;

    // this.$anchor.addEventListener("mousedown", e => this.resizeStart(e))
    this.$anchor.addEventListener("pointerdown", e => this.resizeStart(e));

    this.$anchor.addEventListener("pointerup", e => this.resizeEnd(e));
    this.$anchor.addEventListener("pointercancel", e => this.resizeEnd(e))
    this.$anchor.addEventListener("pointerleave", e => this.resizeEnd(e));

    this.resizeMove = this.resizeMove.bind(this);

    const split = localStorage.getItem("split");
    if (split !== null) {
      this.setSplit(split);
    }
  }

  setSplit(value) {
    let clampedPosition = clamp(value, this.min, this.max);
    this.$html.style.setProperty(this.grooupsPanelClassName, `${clampedPosition}%`)
    localStorage.setItem("split", clampedPosition);
  }

  resizeStart(e) {
    this.$body.classList.add("--resizing");
    this.$anchor.setPointerCapture(e.pointerId);
    this.$anchor.addEventListener("pointermove", this.resizeMove);
  }

  resizeMove(e) {
    let y = e.clientY;
    let yPosition = Math.round((y / (window.innerHeight)) * 100);
    this.setSplit(yPosition);
  }

  resizeEnd(e) {
    this.$body.classList.remove("--resizing");
    this.$anchor.removeEventListener("pointermove", this.resizeMove);
    this.$anchor.releasePointerCapture(e.pointerId)
  }

}