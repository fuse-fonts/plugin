import csInterface from "helpers/cs-interface";

export function addListener() {
  csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, detectTheme);
}

export function removeListener() {
  csInterface.removeEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, detectTheme);
}

export function detectTheme() {

  const red = csInterface.getHostEnvironment().appSkinInfo.panelBackgroundColor.color.red;

  const theme = {
    DARK: "theme--dark",
    MEDIUM: "theme--medium",
    LIGHT: "theme--light",
    BRIGHT: "theme--bright",
  };
  
  // clear theme from before
  document.body.classList.remove(...Object.keys(theme).map(k => theme[k]));

  if (red <= 50) document.body.classList.add(theme.DARK);
  else if (red <= 83) document.body.classList.add(theme.MEDIUM);
  else if (red <= 184) document.body.classList.add(theme.LIGHT);
  else if (red <= 240) document.body.classList.add(theme.BRIGHT);
  else document.body.classList.add(theme.DARK);
}