/*
  Loaded before-hand, and attached to the window.
  window.CSInterface
*/

let csInterface = null;

if (window.CSInterface) {
  csInterface = new CSInterface();
}


export default csInterface;