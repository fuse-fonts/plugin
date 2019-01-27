
const csInterface = new CSInterface();

const timeStart = performance.now();
// the ul that we will render to
const $list = document.querySelector(".font-list__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);

csInterface.setContextMenuByJSON(`{ "menu": [{"id": "hi", label": "hi"}]}`, () => {});

/**
 * Button for refreshing fonts
 */
// let $loadFonts = document.querySelector(".load-fonts");
// $loadFonts.addEventListener("click", (r) => fm.refresh.call(fm, r));

/**
 * Buttons for creating a new group
 */
let $addGroup = document.querySelectorAll(".add-group");
Array.from($addGroup).forEach( el => el.addEventListener("click", (e) => fm.createGroup() ));

/**
 * Button for applying the currently selected typeface to the current layer
 */
const $applyTypeFace = document.querySelector(".apply-typeface");
$applyTypeFace.addEventListener("click", (e) => fm.applySelectedTypeface());

/**
 * Button for deleting groups
 */
const $deleteGroups = document.querySelector(".toggle-group-deletions");
const $deleteGroupsIcons = $deleteGroups.querySelector("i");
$deleteGroups.addEventListener("click", (e) => {
  document.body.classList.toggle("--allow-deletions");
  $deleteGroupsIcons.innerText = $deleteGroupsIcons.innerText === "delete_sweep" ? "delete_sweep" : "delete_sweep";
  $deleteGroups.classList.toggle("--active");
});


/**
 * input for changing the preview font text
 */
// TODO: debounce
$text = document.querySelector(".font-list__text");
$text.addEventListener("keyup", (e) => {
  fm.updateText($text.value || "");
});

/**
 * input for filtering the list of ALL FONTS
 */
// TODO: debounce
$filter = document.querySelector(".font-list__filter");
$filter.addEventListener("keyup", (e) => {
  let text = ($filter.value || "").trim().toLowerCase();
  fm.filter(text);
});



/*
Startup Code
*/
document.body.classList.add("--loading");

fm.detectTheme();
csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, (e) => fm.detectTheme());

fm.refresh().then(r => {
  
  fm.load();
  fm.render();

  document.body.classList.remove("--loading");
  
  const timeEnd = performance.now();
  const timeRead = ((timeEnd - timeStart) / 1000).toFixed(2);
  fm.notify(`Loaded ${fm.fonts.length} fonts in ${timeRead}s`, 6000)
});

