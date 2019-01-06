# adobe-plugin-project

## Developing

1. Clone repository into your `/c/Users/<USER>/AppData/Roaming/Adobe/CEP/extensions/` directory (Create if doesn't exist).
2. Restart photoshop.


## Building

1. `npm install`
2. Download [zxp utility](https://github.com/Adobe-CEP/Getting-Started-guides/tree/master/Package%20Distribute%20Install#download-the-signing-and-packaging-tool-zxpsigncmd) into your cloned repository. Place in root directory.
3. `npm run build`


## Resources

1. [Adobe CEP Github](https://github.com/Adobe-CEP)
2. [Getting Started Guide](https://github.com/Adobe-CEP/Getting-Started-guides)
1. https://javascript-tools-guide.readthedocs.io/index.html
2. [Manifest schema](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/ExtensionManifest_v_7_0.xsd)
3. [Host/client Interop](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#invoke-point-products-scripts-from-html-extension)