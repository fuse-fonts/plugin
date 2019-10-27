import csInterface from "helpers/cs-interface";
import { writable } from "svelte/store";



export function addThemeChangeListener() {
  csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, detectTheme);
}

export function removeThemeChangeListener() {
  csInterface.removeEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, detectTheme);
}

export function addPostMessageListener() {

  const callback = (event) => {
    const data = event.data;
    theme.set(data);
  };

  window.addEventListener("message", callback);

  return  () => window.removeEventListener("message", callback);
}

export const THEME = {
  DARK: "theme--dark",
  MEDIUM: "theme--medium",
  LIGHT: "theme--light",
  BRIGHT: "theme--bright",
};

export const theme = writable(THEME.DARK);

export function detectTheme() {

  const red = csInterface.getHostEnvironment().appSkinInfo.panelBackgroundColor.color.red;

  if (red <= 50) theme.set(THEME.DARK);
  else if (red <= 83) theme.set(THEME.MEDIUM);
  else if (red <= 184) theme.set(THEME.LIGHT);
  else if (red <= 240) theme.set(THEME.BRIGHT);
  else theme.set(THEME.DARK);
}

theme.subscribe( themeClassName => {
  // clear theme from before
  document.body.classList.remove(...Object.values(THEME));
  document.body.classList.add(themeClassName);
});