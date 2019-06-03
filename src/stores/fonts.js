import { readable } from 'svelte/store';

export default readable({ firstRender: true}, set => {

  const title = "hello world";
  const firstRender = false;
  
  window.setTimeout(() => set({ firstRender, title, }), 5000);
  
  const stop = () => false;

  return stop;
});