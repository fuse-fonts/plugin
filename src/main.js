
import App from "App.html";
import Loading from "components/Loading.html";
import fonts from "stores/fonts";


const appLoader = new Loading({
  target: document.querySelector("main#app"),
  props: {
    color: "#2ad",
    text: "Starting your app",
  },
});

// we only show the loading until the first render.
let app = null;


const unsubscribe = fonts.subscribe(value => {

  // we wait until connected to firebase to stop showing the loading screen
  if (value.firstRender) {

    app = new App({
      target: document.querySelector("main#app"),
      // we could pass props from 'value' here, if needed
    });

    appLoader.$destroy();
  }

  // app.$set( ... )
  // we could update app with props from our app, if needed.
})
