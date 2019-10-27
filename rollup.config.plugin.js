import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import includePaths from 'rollup-plugin-includepaths';

export default {
  input: 'src/plugin/main.js',
  output: {
    file: 'client/scripts/bundle.js',
    format: 'iife'
  },


  plugins: [
    json({
      compact: true,
    }),
    //resolve node.js modules from node_modules
    resolve(),

    //set an include path so we can do simpler imports without needed to traverse up trees
    includePaths({ paths: ["src/plugin"], }),

    // auto convert commonjs / modejs modues to es6 modules.
    commonjs({
      sourceMap: true, // default: true
    }),

    //trasnform svelte web components into their scripts
    svelte({

      // You can restrict which files are compiled
      // using `include` and `exclude`
      include: 'src/**/*.svelte',

      // By default, the client-side compiler is used. You
      // can also use the server-side rendering compiler
      // generate: 'ssr',

      // Extract CSS into a separate file (recommended).
      // See note below
      css: function (css) {
        // console.log(css.code); // the concatenated CSS
        // console.log(css.map); // a sourcemap

        // creates `main.css` and `main.css.map` — pass `false`
        // as the second argument if you don't want the sourcemap
        css.write('client/stylesheets/main.css');

      }
    }),
    
    // when ready for a production build:
    // transpile ES2015+ to ES5
		// buble({
		// 	exclude: ['node_modules/**']
		// })
  ]
}
