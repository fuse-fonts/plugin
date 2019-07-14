import TypefaceLibrary from "datatypes/typeface-library.js";

export default class CustomGroup {

  constructor(name, permanent = false) {
    this.name = name;
    this.typefaces = new TypefaceLibrary();
    this.isActive = false;
    this.permanent = permanent;
  }

  updateTypeFaces(typefaces) {
    this.typefaces = typefaces;
  }

  static getDefaultName(otherGroups) {
    const base = (i) => `Group ${i}`;
    
    let name = null;
    let n = 1;

    while (name === null) {
      let exists = otherGroups.find(g => g.name === base(n));
      if (exists) n++;
      else name = base(n);
    }

    return name;
  }
}
