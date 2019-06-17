import TypeFace from "datatypes/typeface.js";

/**
 * Helper for handling typefaces
 *  
 */
export default class TypeFaceLibrary {

  constructor(data) {
    if (data) {
      this.data = data;
    }
    else {
      this.data = Object.create(null);
    }
  }

  static parseFonts(fontsJSON) {
    
    const typefaces = new TypeFaceLibrary();

    if (fontsJSON !== null) {
      fontsJSON.forEach((font) => typefaces.fromFont(font));
    }

    return typefaces;
  }


  /**
   * 
   * @param {TextFont} font 
   */
  fromFont(font) {
    const { data } = this;
    if (!data[font.family]) {
      data[font.family] = new TypeFace(font.family);
    }

    data[font.family].addVariant(font);
  }

  /**
  * Adds the parameter typeface to the library.
  * @param {TypeFace} typeface
  */
  add(typeface) {
    const { data } = this;
    if (!data[typeface.family]) {
      data[typeface.family] = typeface;
    }
  }

  /**
   * Removes the parameter typeface from the library
   * @param {TypeFace} typeface 
   */
  remove(typeface) {
    const { data } = this;
    if (typeface.family) {
      delete data[typeface.family];
    }
  }

  includes(family) {
    return !!this.data[family];
  }

  /**
   * 
   * @param {TypeFace} typeface 
   */
  has(typeface) {
    return this.data[typeface.family] === typeface;
  }

  toString() {
    return JSON.stringify(this.data);
  }
}