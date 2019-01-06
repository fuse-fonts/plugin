console.log("Building...");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const outputDirectory ="bin/plugin";
const inputDirectories = [
  "client",
  "csxs",
  "host",
];

// clean out previous build, if applicable
shell.rm("-R", outputDirectory);
shell.mkdir(outputDirectory);

inputDirectories.forEach(folder => (console.log(`  — Copying '${folder}'`), shell.cp("-R", folder, `${outputDirectory}/${folder}`)));

console.log(`Build complete -> ${outputDirectory}`);