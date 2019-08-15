import { writable } from "svelte/store";
import userSettingsRepository from "repositories/user-settings.js";
import csInterface from "helpers/cs-interface.js";

export const defaultSettings = {
  applyTypeface: true,
  panelSplit: 20,
  listView: true,
  fontSize: csInterface.getHostEnvironment().appSkinInfo.baseFontSize || 10,
};

function resetableSettingsStore() {
  
  const cachedSettings = userSettingsRepository.load();
  
  const store = writable(cachedSettings || defaultSettings);
  const { subscribe, set, update } = store;
  
  // break out of svelte to modify our base font size
  const html = document.querySelector("html");
  
  subscribe(data => {
    const fontSize = (data.fontSize ? data.fontSize : defaultSettings.fontSize);
    
    html.style.fontSize = `${fontSize}px`;
    
    userSettingsRepository.save(data);
  });

  return {
    subscribe,
    set,
    update,
    reset: () => set(defaultSettings),

    setSplit: (panelSplit) => update( values => Object.assign({}, values, { panelSplit, })),

    setFontSize: (fontSize) => update(values => Object.assign({}, values, { fontSize, })),

    toggleSetting: (key) => update(values => Object.assign({}, values, { [key]: !values[key], })),
  };
}

export const settings = resetableSettingsStore();

export const settingsOpened = writable(false);

export const displayLog = writable(false);