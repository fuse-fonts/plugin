console.log("Building...");
const shell = require("shelljs");

const manifest = {
  source: "csxs/manifest.prod.xml",
  target: "manifest.xml"
};

const outputDirectory ="build/";
const inputDirectories = [
  "client",
  "host",
];

// clean out previous build, if applicable
console.log(`Removing ${outputDirectory}`)
shell.rm("-R", outputDirectory);

console.log(`Re-creating ${outputDirectory}`)
shell.mkdir(outputDirectory);

inputDirectories.forEach(folder => {
  console.log(`  — Copying '${folder}'`);
  shell.cp("-R", folder, `${outputDirectory}/${folder}`);
});

console.log(`Copying production manifest: ${manifest.source} -> ${outputDirectory}/${manifest.target}`);
shell.mv(`${manifest.source}`, `${outputDirectory}/${manifest.target}`);

console.log(`Build complete -> ${outputDirectory}`);