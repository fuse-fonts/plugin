
import fontRepository from "repositories/fonts.js";

export const testLoadFonts = () => ({
    test: "Load Fonts from file system",
    run: async () => fontRepository.load(false).then( fonts => `Loaded ${fonts.length} fonts`)
});

export const testLoadFontsCache = () => ({

    test: "Load Fonts from local storage",
    result: "Not Ran",
    run: async () => fontRepository.load(true).then( fonts => `Loaded ${fonts.length} fonts from local storage`)
});


export const allTests = [
    testLoadFonts(),
    testLoadFontsCache(),
];

