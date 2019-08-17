# adobe-plugin-project

## Developing

1. Clone repository into your `/c/Users/<USER>/AppData/Roaming/Adobe/CEP/extensions/` directory (Create if doesn't exist).
2. Restart photoshop.
3. run `npm run dev` to start the rollup bundler/transforms


### Debugging
1. Follow instructions in [CEP Resources guide to setup dev debugging](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#remote-debugging) (create registry edit etc)
2. If you can't connect to the port, you may need to check logs for the error `C:\Users\<USER>\AppData\Local\Temp`
  1.  `CEPHtmlEngine9-PHXS-20.0.4-com.fusefonts.log` should say
    > DevTools listening on 127.0.0.1:8888


## Building the plugin

### First time setup:
1.  `npm install`
  Adds all dependencies and downloads the ZXPSignCmd for your platform 
2.  Add your `.env`.
    Refer to `.env.example` for necessary fields.
2.  `npm run self-sign`
  Creates a `certificate.p12` to sign the packaged `.zxp`.

### After initial setup

After performing the steps in first time setup, you can simple run the below command whenever you need to generate the zxp.

1.  `npm run package`
  Builds and signs zxp, and places into `/dist`

## Plugin Installer
1. https://github.com/fuse-fonts/installer


*Todo: add integration or git submodule.*


## Resources

1. [Adobe CEP Github](https://github.com/Adobe-CEP)
2. [Getting Started Guide](https://github.com/Adobe-CEP/Getting-Started-guides)
1. https://javascript-tools-guide.readthedocs.io/index.html
2. [Manifest schema](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/ExtensionManifest_v_7_0.xsd)
3. [Host/client Interop](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#invoke-point-products-scripts-from-html-extension)
4. [Scripting Documents](https://www.adobe.com/devnet/scripting.html)
5. [Adobe Extensions Forum](https://forums.adobe.com/community/creative_cloud/add-ons/extensions) - has links, too
6. [Extension Installer](https://github.com/Hennamann/CEP-Extension-Installer)
7. https://www.ps-scripts.com/

