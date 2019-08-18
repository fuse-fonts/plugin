// this file let's us use adobe's CS-interface without having to worry


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
      console.log("__adobe_cep__.getHostEnvironment called")
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
  }
}