import TypeFace from "datatypes/typeface.js";

/**
 * Helper for handling typefaces
 *  
 */
export default class TypefaceLibrary {

  constructor(data) {
    if (data) {
      this.data = data;
    }
    else {
      this.data = Object.create(null);
    }
  }

  static parseFonts(fontsJSON) {
    
    const typefaces = new TypefaceLibrary();

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

  /**
   * Removes the variant within the TypeFace of this library
   * @param {TypeFace} typeface 
   * @param {string} variantName
   */
  removeVariant(familyName, variantName) {

    if (this.includes(familyName)) {
      const family = this.get(familyName);
      const isEmpty = family.removeVariant(variantName);

      if (isEmpty) {
        this.remove(family);
      }
    }
  }

  includes(family) {
    return !!this.data[family];
  }

  /** get
   *  Retrieve a typeface from this library, or null if it doesn't exist
   * @param {string} family 
   */
  get(family) {
    return this.data[family] || null;
  }

  /**
   * 
   * @param {TypeFace} typeface 
   */
  has(typeface) {
    return typeface !== null && this.data[typeface.family] === typeface;
  }

  toList() {
    return Object.values(this.data);
  }

  toString() {
    return JSON.stringify(this.data);
  }

  clear() {
    this.data = {};
  }

  merge(typefaceLibrary) {
    
    for (let family in typefaceLibrary.data) {
      const typeface = typefaceLibrary.data[family];

      if (this.includes(family)) {

        const existingTypeface = this.get(family);
        // resolve any variants that may need adding
        typeface.variants.forEach(variant => {
          
          const isIncluded = existingTypeface.variants.find(v => v.name === variant.name) || false;

          if (!isIncluded) {
            existingTypeface.variants.push(variant);
          }

        });
      }
      else {
        this.add(typeface);
      }
    }
  }

  /**
   * 
   * @param {TypefaceLibrary} instance 
   */
  static toModel(instance) {
    if (instance) {
      const model = {};
      for (let family in instance.data) {
        const typeface = instance.data[family];
        model[family] = typeface.variants.map(v => v.name);
      }

      return model;
    }
    else {
      return null;
    }
  }

  /**
   * 
   * @param {TypefaceStore} $typefaces the typeface store of all typefaces, from stores/typefaces.js
   * @param {*} model a shallow copy of a typeface library. to `TypefaceLibrary::toModel`
   */
  static populateFromModel($typefaces, model) {

    const library = new TypefaceLibrary();
    for (let family in model) {

      const variants = model[family];
      const typeface = TypeFace.clone($typefaces.get(family), variants);

      if (typeface !== null) {
        library.add(typeface);
      }
    }

    return library;
  }
}