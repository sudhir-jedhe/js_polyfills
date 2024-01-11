const isIOS =
  [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ].indexOf(navigator.platform) !== -1;

/************************************* */

function iOS() {
  var Devices = [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ];
  if (!!navigator.platform) {
    while (Devices.length) {
      if (navigator.platform === Devices.pop()) {
        return true;
      }
    }
  }
  return false;
}
function gfg_Run() {
  el_down.innerHTML = iOS();
}

/****************************************** */
/* Storing user's device details in a variable*/
let details = navigator.userAgent;

/* Creating a regular expression 
containing some mobile devices keywords 
to search it in details string*/
let regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details 
it returns boolean value*/
let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
  console.log("You are using a Mobile Device");
} else {
  console.log("You are using Desktop");
}

/********************************************* */
function GFG_Fun() {
  var res = "Device is not Android Phone";
  var userAgent = navigator.userAgent.toLowerCase();
  var Android = userAgent.indexOf("android") > -1;

  if (Android) {
    res = "Device is Android Phone";
  }
  return res;
}

/******************************************************** */
function GFG_Fun() {
  var res = "Device is not Android Phone";
  var Android = /(android)/i.test(navigator.userAgent);

  if (Android) {
    res = "Device is Android Phone";
  }

  return res;
}

/********************************************************* */

function androidVersion(ua) {
  ua = (ua || navigator.userAgent).toLowerCase();
  var match = ua.match(/android\s([0-9\.]*)/i);
  return match ? match[1] : undefined;
}

/********************************************************* */

// How to detect Safari, Chrome, IE, Firefox
// and Opera browser using JavaScript?

function checkBrowser() {
  // Get the user-agent string
  let userAgentString = navigator.userAgent;

  // Detect Chrome
  let chromeAgent = userAgentString.indexOf("Chrome") > -1;

  // Detect Internet Explorer
  let IExplorerAgent =
    userAgentString.indexOf("MSIE") > -1 || userAgentString.indexOf("rv:") > -1;

  // Detect Firefox
  let firefoxAgent = userAgentString.indexOf("Firefox") > -1;

  // Detect Safari
  let safariAgent = userAgentString.indexOf("Safari") > -1;

  // Discard Safari since it also matches Chrome
  if (chromeAgent && safariAgent) safariAgent = false;

  // Detect Opera
  let operaAgent = userAgentString.indexOf("OP") > -1;

  // Discard Chrome since it also matches Opera
  if (chromeAgent && operaAgent) chromeAgent = false;

  document.querySelector(".output-safari").textContent = safariAgent;
  document.querySelector(".output-chrome").textContent = chromeAgent;
  document.querySelector(".output-ie").textContent = IExplorerAgent;
  document.querySelector(".output-opera").textContent = operaAgent;
  document.querySelector(".output-firefox").textContent = firefoxAgent;
}
