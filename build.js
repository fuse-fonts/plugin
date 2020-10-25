console.log("Building...");
const shell = require("shelljs");

const outputDirectory ="build/";
const inputDirectories = [
  "client",
  "csxs",
  "host",
];

// clean out previous build, if applicable
console.log(`Removing ${outputDirectory}`)
shell.rm("-R", outputDirectory);

console.log(`Re-creating ${outputDirectory}`)
shell.mkdir(outputDirectory);

inputDirectories.forEach(folder => (console.log(`  — Copying '${folder}'`), shell.cp("-R", folder, `${outputDirectory}/${folder}`)));

console.log(`Build complete -> ${outputDirectory}`);