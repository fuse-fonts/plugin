// this file let's us use adobe's CS-interface without having to worry


/**
 * the host environment we will use internally.
 * this is obtained by calling the following line in the console of an actual running plugin
 * 
 *    JSON.stringify(new CSInterface().hostEnvironment, null, 2)
 * 
 //
 // 
 // 
 */
// 
const _hostEnvironment = {

  appVersion: "20.0.6",
  appLocale: "en_US",
  isAppOnline: true,
  appUILocale: "en_US",
  appName: "PHXS",
  appId: "PHXS",

  appSkinInfo: {
    baseFontSize: 10,
    baseFontFamily: "Tahoma",
    systemHighlightColor: {
        alpha: 255,
        green: 120,
        blue: 215,
        red: 0
    },
    appBarBackgroundColorSRGB: {
      antialiasLevel: 0,
      type: 1,
      color: {
        alpha: 255,
        green: 50,
        blue: 50,
        red: 50
      }
    },
    appBarBackgroundColor: {
      antialiasLevel: 0,
      type: 1,
      color: {
        alpha: 255,
        green: 50,
        blue: 50,
        red: 50
      }
    },
    panelBackgroundColor: {
      antialiasLevel: 0,
      type: 1,
      color: {
        alpha: 255,
        green: 50,
        blue: 50,
        red: 50
      }
    },
    panelBackgroundColorSRGB: {
      antialiasLevel: 0,
      type: 1,
      color: {
        alpha: 255,
        green: 50,
        blue: 50,
        red: 50
      }
    },
  }
};

const interface = "__adobe_cep__";

if (!window.__adobe_cep__) {

  window.__adobe_cep__ = {
    addEventListener: function() {
      console.log("__adobe_cep__.addEventListener called")
    },
    autoThemeColorChange: function () { 
      console.log("__adobe_cep__.autoThemeColorChange called")
    },
    closeExtension: function(){
      console.log("__adobe_cep__.closeExtension called")
    },
    dispatchEvent: function(){
      console.log("__adobe_cep__.dispatchEvent called")
    },
    dumpInstallationInfo: function(){
      console.log("__adobe_cep__.dumpInstallationInfo called")
    },
    evalScript: function(){
      console.log("__adobe_cep__.evalScript called")
    },
    getCurrentApiVersion: function(){
      console.log("__adobe_cep__.getCurrentApiVersion called")
    },
    getCurrentImsUserId: function(){
      console.log("__adobe_cep__.getCurrentImsUserId called")
    },
    getExtensionId: function(){
      console.log("__adobe_cep__.getExtensionId called")
    },
    getExtensions: function(){
      console.log("__adobe_cep__.getExtensions called")
    },
    getHostCapabilities: function(){
      console.log("__adobe_cep__.getHostCapabilities called")
    },
    getHostEnvironment: function(){
      console.log("__adobe_cep__.getHostEnvironment called");
      return JSON.stringify(_hostEnvironment);
    },
    getMonitorScaleFactor: function(){
      console.log("__adobe_cep__.getMonitorScaleFactor called")
    },
    getNetworkPreferences: function(){
      console.log("__adobe_cep__.getNetworkPreferences called")
    },
    getScaleFactor: function(){
      console.log("__adobe_cep__.getScaleFactor called")
    },
    getSystemPath: function(){
      console.log("__adobe_cep__.getSystemPath called")
    },
    imsConnect: function(){
      console.log("__adobe_cep__.imsConnect called")
    },
    imsDisconnect: function(){
      console.log("__adobe_cep__.imsDisconnect called")
    },
    imsFetchAccessToken: function(){
      console.log("__adobe_cep__.imsFetchAccessToken called")
    },
    imsFetchAccounts: function(){
      console.log("__adobe_cep__.imsFetchAccounts called")
    },
    imsSetProxyCredentials: function(){
      console.log("__adobe_cep__.imsSetProxyCredentials called")
    },
    initResourceBundle: function(){
      console.log("__adobe_cep__.initResourceBundle called")
    },
    invokeAsync: function(){
      console.log("__adobe_cep__.invokeAsync called")
    },
    invokeSync: function(){
      console.log("__adobe_cep__.invokeSync called")
    },
    registerInvalidCertificateCallback: function(){
      console.log("__adobe_cep__.registerInvalidCertificateCallback called")
    },
    registerKeyEventsInterest: function(){
      console.log("__adobe_cep__.registerKeyEventsInterest called")
    },
    removeEventListener: function(){
      console.log("__adobe_cep__.removeEventListener called")
    },
    requestOpenExtension: function(){
      console.log("__adobe_cep__.requestOpenExtension called")
    },
    resizeContent: function(){
      console.log("__adobe_cep__.resizeContent called")
    },
    setScaleFactorChangedHandler: function(){
      console.log("__adobe_cep__.setScaleFactorChangedHandler called")
    },
    showAAM: function(){
      console.log("__adobe_cep__.showAAM called")
    },
  };
}