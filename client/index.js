
const csInterface = new CSInterface();

// the ul that we will render to
const $list = document.querySelector(".font-list__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);

let $groupList = document.querySelectorAll(".toggle-group-list")
Array.from($groupList).forEach(el => el.addEventListener("click", (e) => fm.tray.toggle()));



/**
 * Button for refreshing fonts
 */
let $loadFonts = document.querySelector(".load-fonts");
$loadFonts.addEventListener("click", (r) => fm.refresh.call(fm, r));

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

// csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, (e) => {
//   console.log("todo: theme changed");
//   var env = csInterface.getHostEnvironment();
// });

document.body.classList.add("--loading");

fm.refresh().then(r => {
  // fm.render();

  fm.createGroup("Grunge Fonts");
  // fm.createGroup("Grunge");
  // fm.createGroup("Beautiful Cursives");

  document.body.classList.remove("--loading");
});

