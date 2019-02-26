
const csInterface = new CSInterface();


// the ul that we will render to
const $list = document.querySelector(".fonts-panel__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);

csInterface.setContextMenuByJSON(`{ "menu": [{"id": "hi", label": "hi"}]}`, () => {});

/* Menu Panel Actions */
const menuXML = document.getElementById("menu").innerHTML;
csInterface.setPanelFlyoutMenu(menuXML);
csInterface.addEventListener(CSInterface.FLYOUT_MENU_CLICKED_EVENT, (e) => fm.menuItemClicked(e));

/*
Startup Code
*/
fm.loading(true);

fm.detectTheme();
csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, (e) => fm.detectTheme());

window.setTimeout(() => fm.load().then(r => fm.loading(false)), 1000);




