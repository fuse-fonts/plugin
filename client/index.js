
const csInterface = new CSInterface();


// the ul that we will render to
const $list = document.querySelector(".fonts-panel__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);

csInterface.setContextMenuByJSON(`{ "menu": [{"id": "hi", label": "hi"}]}`, () => {});



/*
Startup Code
*/
document.body.classList.add("--loading");

fm.detectTheme();
csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, (e) => fm.detectTheme());

fm.load().then(r => {
  fm.render();
  document.body.classList.remove("--loading");
});

