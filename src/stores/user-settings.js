import { writable } from "svelte/store";

export const defaultSettings = {
  applyTypeface: true,
  panelSplit: 20,
};

function resetableSettingsStore() {

  const store = writable(defaultSettings);
  const { subscribe, set, update } = store;

  return {
    subscribe,
    set,
    update,
    reset: () => set(defautlSettings),
  };
}

export const settings = resetableSettingsStore();