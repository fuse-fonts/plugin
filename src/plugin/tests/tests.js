
import fontRepository from "repositories/fonts.js";
import fileSystemRepository from "repositories/file-system.js";
import customGroupRepository from "repositories/custom-groups.js";

const GROUP = {
    UTIL: Symbol("Utilities"),
    REPO: Symbol("Repositories"),
    SERVICE: Symbol("Services")
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
    run: async () => customGroupRepository.load().then(r => `Loaded ${r.length} custom groups`),
});

export const test_saveCustomGroups = () => ({
    label: "Save Custom Groups",
    group: GROUP.REPO,
    run: async () => customGroupRepository.load()
    .then(groups => {
        customGroupRepository.save(groups);
        return `Saved ${groups.length} groups`;
    }),
});


export const test_createBackupFolder = () => ({
    label: "Create Backup Directory",
    group: GROUP.REPO,
    run: () => (fileSystemRepository.createFolderIfNotExists(), `Created ${fileSystemRepository.backupDirectory}`),
});


export const allTests = [
    test_LoadFonts(),
    test_LoadFontsCache(),
    test_loadCustomGroups(),
    test_saveCustomGroups(),
    test_createBackupFolder(),
];

