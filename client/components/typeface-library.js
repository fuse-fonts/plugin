/**
 * Helper for handling typefaces
 *    I realized I could've used a Map instead.
 */
class TypeFaceLibrary {

  constructor() {
    // this.from = this.from.bind(this);
    // this.add = this.add.bind(this);
    // this.remove = this.remove.bind(this);
    // this.toList = this.toList.bind(this);
    // this.includes = this.includes.bind(this);
    // this.has = this.has.bind(this);
  }

  /**
   * 
   * @param {TextFont} font 
   */
  from(font) {

    if (!this[font.family]) {
      this[font.family] = new TypeFace(font.family);
    }

    this[font.family].addVariant(font);
  }

  /**
  * Adds the parameter typeface to the library.
  * @param {TypeFace} typeface
  */
  add(typeface) {
    if (!this[typeface.family]) {
      this[typeface.family] = typeface;
    }
  }

  /**
   * Removes the parameter typeface from the library
   * @param {TypeFace} typeface 
   */
  remove(typeface) {
    if (typeface && typeface.family) {
      delete this[typeface.family];
    }
  }

  toList() {
    return Object.values(this);
  }

  includes(family) {
    return !!this[family];
  }

  /**
   * 
   * @param {TypeFace} typeface 
   */
  has(typeface) {
    if (!typeface) return false;
    return this[typeface.family] === typeface;
  }
}