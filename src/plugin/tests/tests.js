
import { get } from "svelte/store";
import fontRepository from "repositories/fonts.js";
import fileSystemRepository from "repositories/file-system.js";
import customGroupRepository from "repositories/custom-groups.js";
import typefaceRepository from "repositories/typefaces.js";
import TypefaceLibrary from "datatypes/typeface-library.js";

import { customGroups, selected, createGroup, deleteSelectedGroup } from "stores/custom-groups.js";
import CustomGroup from "datatypes/custom-group";

import { applyTypeface } from "helpers/font-tool.js";
import { typefaces, loadData } from "stores/typefaces.js";

const GROUP = {
    HOST: Symbol("Host"),
    UTIL: Symbol("Utilities"),
    REPO: Symbol("Repositories"),
    USER: Symbol("User Actions"),
}

export const test_LoadFonts = () => ({
    label: "Load Fonts from file system",
    group: GROUP.REPO,
    run: async () => fontRepository.load(false).then( fonts => `Loaded ${fonts.length} fonts`),
});

export const test_LoadFontsCache = () => ({
    label: "Load Fonts from local storage",
    group: GROUP.REPO,
    run: async () => fontRepository.load(true).then( fonts => `Loaded ${fonts.length} fonts from local storage`),
});


export const test_loadCustomGroups = () => ({
    label: "Load Custom Groups",
    group: GROUP.REPO,
    run: async () => customGroupRepository.load(get(typefaces)).then(r => `Loaded ${r.length} custom groups`),
});


export const test_createBackupFolder = () => ({
    label: "Create Backup Directory",
    group: GROUP.REPO,
    run: () => (fileSystemRepository.createFolderIfNotExists(), `Created ${fileSystemRepository.backupDirectory}`),
});

export const test_saveBackup = () => ({
    label: "Create Backup File",
    group: GROUP.REPO,
    run: () => (fileSystemRepository.save("{}"), `Saved empty ${fileSystemRepository.backupFileName}`)
});

export const test_saveCustomGroups = () => ({
    label: "Save Custom Groups",
    group: GROUP.REPO,
    run: async () => customGroupRepository.load(get(typefaces))
    .then(groups => {
        customGroupRepository.save(groups);
        return `Saved ${groups.length} groups`;
    })
});

export const test_saveErrorFile = () => ({
    label: "Save Error File",
    group: GROUP.REPO,
    run: async () => fileSystemRepository.saveErrorFile("test", "This is the result of testing that error files can be saved. Test Passed.")
        .then( path => `Saved to ${path}`)
});

export const test_loadFromBackup = () => ({
    label: `Load ${fileSystemRepository.backupFileName}`,
    group: GROUP.REPO,
    run: () => (fileSystemRepository.load(), `Loaded from ${fileSystemRepository.backupFilePath}`),
})

const typefaceMock = { "__FAKE_FAMILY_": "__FAKE_TYPEFACE_"};
export const test_saveTypefacesToCache = () => ({
    label: "Save typefaces to cache",
    group: GROUP.REPO,
    run: () => {
        typefaceRepository.save(new TypefaceLibrary(typefaceMock))
        return "Saved mock typefaces."
    },
});

export const test_loadTypefacesFromCache = () => ({
    label: "Load typefaces from cache",
    group: GROUP.REPO,
    run: async () => {
        const library = await typefaceRepository.load(true)
        
        if (!library.includes("__FAKE_FAMILY_")) {
            throw new Error("Didn't load mock family");
        }
        return "Loaded typefaces mock library from local storage"
    },
});


export const test_clearTypefacesCache = () => ({
    label: "Clear typefaces cache",
    group: GROUP.REPO,
    run: () => (typefaceRepository.clear(), "Cleared typefaces mock data from local storage")
});

export const test_createCustomGroup = () => ({
    label: "Create a Custom Group",
    group: GROUP.USER,
    fixture: null,
    run: () => {
        createGroup();

        const groupList = get(customGroups);
        test_createCustomGroup.fixture = groupList[groupList.length - 1];
        const isCustomGroup = test_createCustomGroup.fixture instanceof CustomGroup;
        if (!isCustomGroup) {
            throw new Error("Created group was not a CustomGroup");
        }
        
        return `Created custom group with an ID of ${test_createCustomGroup.fixture.ID}`;
    }
});

export const test_selectCustomGroup = () => ({
    label: "Select a Custom Group",
    group: GROUP.USER,
    run: () => {

        if (test_createCustomGroup.fixture === null) {
            test_createCustomGroup.run();
        }

        const { ID } = test_createCustomGroup.fixture;

        selected.set(test_createCustomGroup.fixture);
        return `Select group with ID of ${ID}`;
    }
});

export const test_deleteCustomGroup = () => ({
    label: "Delete a Custom Group",
    group: GROUP.USER,
    run: () => {
        
        if (test_createCustomGroup.fixture === null) {
            test_createCustomGroup.run();
        }

        const { ID } = test_createCustomGroup.fixture;
        selected.set(test_createCustomGroup.fixture);
        deleteSelectedGroup();
        return `Delete group with ID of ${ID}`;
    }
});

export const test_getFontListFromHost = () => ({
    label: "Load Fonts from host",
    group: GROUP.HOST,
    run: async () => fontRepository.loadScript(fontRepository.GET_FONT_LIST_JSX).promise.then( r => `Loaded ${fontRepository.GET_FONT_LIST_JSX}`),
});

export const test_parseFontListFromHost = () => ({
    label: "Parse Fonts from host",
    group: GROUP.HOST,
    run: async () => {
        const result = await fontRepository.loadScript(fontRepository.GET_FONT_LIST_JSX).promise;
        const data = JSON.parse(result);
        return `Parsed ${data.length} fonts`;
    }
});

export const test_applyTypeFace = () => ({
    label: "Apply a Typeface",
    group: GROUP.HOST,
    run: async () => {
        await loadData();
        const library = get(typefaces);
        if (library === null) {
            throw new Error("No data to work with")
        }
        
        const typeface = library.get("Times New Roman");

        await applyTypeface(typeface, null);
        return `Applied ${typeface.family}'s default variant '${typeface.defaultVariant}'`;
    }
});

export const allTests = [
    
    test_getFontListFromHost(),
    test_parseFontListFromHost(),
    test_applyTypeFace(),

    test_LoadFonts(),
    test_LoadFontsCache(),
    test_loadCustomGroups(),
    test_createBackupFolder(),
    test_saveBackup(),
    test_saveCustomGroups(),
    test_saveErrorFile(),
    test_loadFromBackup(),
    test_saveTypefacesToCache(),
    test_loadTypefacesFromCache(),
    test_clearTypefacesCache(),

    test_createCustomGroup(),
    test_selectCustomGroup(),
    test_deleteCustomGroup(),

];

