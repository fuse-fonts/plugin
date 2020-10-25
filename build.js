const buildLog = (msg) => {
  console.log(`[build] ${msg}`);
};

let indent = " —";

buildLog("Starting build");
const shell = require("shelljs");

const manifest = {
  source: "csxs/manifest.prod.xml",
  target: "csxs/manifest.xml"
};

const outputDirectory ="build/";
const inputDirectories = [
  "client",
  "host",
  "csxs",
];

// clean out previous build, if applicable
buildLog(`Cleaning ${outputDirectory}`)
shell.rm("-R", outputDirectory);

buildLog(`Building...`)
shell.mkdir(outputDirectory);

inputDirectories.forEach(folder => {
  buildLog(`${indent} Copying '${folder}'`);
  shell.cp("-R", folder, `${outputDirectory}/${folder}`);
});

buildLog(`Using Production manifest`);
buildLog(`${indent} Rename: ${outputDirectory}${manifest.source} -> ${outputDirectory}${manifest.target}`);
shell.mv(`${outputDirectory}${manifest.source}`, `${outputDirectory}${manifest.target}`);

buildLog(`Build complete.`);