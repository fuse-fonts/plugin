
// because photoshop doesn't have a version of CEF that supports extending EventTarget yet,
// we use this dummy interface to achieve the same thing.
class Emitter {
  constructor() {
    var delegate = document.createDocumentFragment();
    [
      'addEventListener',
      'dispatchEvent',
      'removeEventListener'
    ].forEach(f => this[f] = (...xs) => delegate[f](...xs))
  }
}

class Panel extends Emitter {
  constructor() {
    super();
  }
}