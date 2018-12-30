
const csInterface = new CSInterface();

// the ul that we will render to
const $list = document.querySelector(".font-list__list");

// our font manager instance
let fm = new FontManager(csInterface, $list);


// csInterface.setWindowTitle("Hello, Erik!");

let fonts = [];

let $loadFonts = document.querySelector(".load-fonts");
$loadFonts.addEventListener("click", (r) => fm.refresh.call(fm, r));

let $addGroup = document.querySelector(".add-group");
$addGroup.addEventListener("click", (r) => {
  
  let name = prompt("Enter a name.");

  if (name !== null) {
    name = name.trim();
    if (name.length > 0 && !fm.hasGroup(name)) {
      fm.createGroup(name);
    }

  }
});

// TODO: debounce
$text = document.querySelector(".font-list__text");
$text.addEventListener("keyup", (e) => {
  fm.updateText($text.value || "");
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

