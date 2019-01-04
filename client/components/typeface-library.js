/**
 * Helper for handling typefaces
 *    I realized I could've used a Map instead.
 */
class TypeFaceLibrary {
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

  /**
   * 
   * @param {TypeFace} typeface 
   */
  has(typeface) {
    if (!typeface) return false;
    return this[typeface.family] === typeface;
  }
}