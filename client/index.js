
const csInterface = new CSInterface();

// set our font size to match the current device
// const baseFontSize = csInterface.getHostEnvironment().appSkinInfo.baseFontSize;
// document.querySelector("html").style.fontSize = `${baseFontSize}px`;

// the ul that we will render to
const $list = document.querySelector(".fonts-panel__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);


/* Menu Panel Actions */
const menuXML = document.getElementById("menu").innerHTML;
csInterface.setPanelFlyoutMenu(menuXML);
csInterface.setContextMenu(menuXML, menuID => fm.menuAction(menuID));
csInterface.addEventListener(CSInterface.FLYOUT_MENU_CLICKED_EVENT, (e) => fm.menuItemClicked(e));

/*
Startup Code
*/
fm.loading(true);

fm.detectTheme();
csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, (e) => fm.detectTheme());

fm.load().then(r => {
    fm.loading(false, true);
});




