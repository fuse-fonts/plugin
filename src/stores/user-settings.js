import { writable } from "svelte/store";
import userSettingsRepository from "repositories/user-settings.js";

const initialSettingsOpen = false;
export const defaultSettings = {
  applyTypeface: true,
  panelSplit: 20,
  listView: true,
};

function resetableSettingsStore() {
  
  const cachedSettings = userSettingsRepository.load();

  const store = writable(cachedSettings || defaultSettings);
  const { subscribe, set, update } = store;


  subscribe(data => userSettingsRepository.save(data));

  return {
    subscribe,
    set,
    update,
    reset: () => set(defaultSettings),
    toggleSetting: (key) => {
      update(values => {
        return {
          ...values,
          [key]: !values[key],
        }
      })
    }
  };
}

export const settings = resetableSettingsStore();

export const settingsOpened = writable(initialSettingsOpen);