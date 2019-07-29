/** Menu.js is not ran within the svelte framework
 *  but it hooks into it via stores
 */
import csInterface from "helpers/cs-interface.js";

// stores
import { createGroup } from "stores/custom-groups.js";
import { settingsOpened } from "stores/user-settings.js";

const supportURL = "https://github.com/fuse-fonts/issue-tracker/issues/new/choose";

const menuID = "menu";



const menuXML = document.getElementById(menuID).innerHTML;

export const initializeMenu = () => {
  csInterface.setPanelFlyoutMenu(menuXML);
  csInterface.addEventListener(window.CSInterface.FLYOUT_MENU_CLICKED_EVENT, (e) => {
    const { data } = e;
    const menuID = data.menuId;
    menuAction(menuID);
  });
};

export const initializeContextMenu = () => {
  csInterface.setContextMenu(menuXML, menuID => menuAction(menuID));
};


export function menuAction(menuID) {
  console.log(`"${menuID}" clicked`);
  switch (menuID) {
    case "feedback":
      csInterface.openURLInDefaultBrowser(supportURL);
      break;
    case "open-settings":
      settingsOpened.set(true);
      break;
    case "create-group":
      createGroup();
      break;
  }

}