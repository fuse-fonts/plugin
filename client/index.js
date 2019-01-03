
const csInterface = new CSInterface();

// the ul that we will render to
const $list = document.querySelector(".font-list__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);

/**
 * Button for refreshing fonts
 */
let $loadFonts = document.querySelector(".load-fonts");
$loadFonts.addEventListener("click", (r) => fm.refresh.call(fm, r));

/**
 * Button for creating a new group
 */
let $addGroup = document.querySelector(".add-group");
$addGroup.addEventListener("click", (r) => {

  let name = prompt("Enter a name.", "", "Create Group");

  if (name !== null) {

    // sanitize
    name = name.trim().replace(/"/gi, "'").replace(/</gi, "&gt;").replace(/</gi, "&lt;")

    if (name.length > 0 && !fm.hasGroup(name)) {
      fm.createGroup(name);
    }

  }
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

// csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, (e) => {
//   console.log("todo: theme changed");
//   var env = csInterface.getHostEnvironment();
// });

document.body.classList.add("--loading");

fm.refresh().then(r => {
  fm.render();
  document.body.classList.remove("--loading");
});

