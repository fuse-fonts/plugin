import { writable } from "svelte/store";

const initialSettingsOpen = false;
export const defaultSettings = {
  applyTypeface: true,
  panelSplit: 20,
  listView: true,
};

function resetableSettingsStore() {

  const store = writable(defaultSettings);
  const { subscribe, set, update } = store;

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