import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import includePaths from 'rollup-plugin-includepaths';

export default [
  // photoshop container bundle
  {
    input: 'src/webapp/index.js',
    output: {
      file: "public/scripts/index.bundle.js",
      format: 'iife'
    },


    plugins: [
      json({
        compact: true,
      }),
      //resolve node.js modules from node_modules
      resolve(),

      //set an include path so we can do simpler imports without needed to traverse up trees
      includePaths({ paths: ["src/webapp", "src/plugin"], }),

      // auto convert commonjs / modejs modues to es6 modules.
      commonjs({
        sourceMap: true, // default: true
      }),

      //trasnform svelte web components into their scripts
      svelte({
        include: 'src/**/*.html',
        css: function (css) {
          css.write('public/stylesheets/index.css');
        }
      }),
    ],
    watch: {
      clearScreen: true
    }
  },

  // plugin bundle
  {
    input: 'src/webapp/plugin.js',
    output: {
      file: "public/scripts/plugin.bundle.js",
      format: 'iife'
    },


    plugins: [
      json({
        compact: true,
      }),
      //resolve node.js modules from node_modules
      resolve(),

      //set an include path so we can do simpler imports without needed to traverse up trees
      includePaths({ paths: ["src/webapp", "src/plugin"], }),

      // auto convert commonjs / modejs modues to es6 modules.
      commonjs({
        sourceMap: true, // default: true
      }),

      //trasnform svelte web components into their scripts
      svelte({
        include: 'src/**/*.html',
        css: function (css) {
          css.write('public/stylesheets/plugin.css');
        }
      }),
    ],
    watch: {
      clearScreen: true
    }
  }
]
