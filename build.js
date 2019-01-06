console.log("Building...");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const outputDirectory ="bin";
const inputDirectories = [
  "client",
  "csxs",
  "host",
];

inputDirectories.forEach(folder => shell.cp("-R", folder, `${outputDirectory}/${folder}`));

console.log("Build complete -> `bin/`");