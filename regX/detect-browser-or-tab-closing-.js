window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});

// The beforeunload function is triggered
// just before the browser or tab is to be
// closed or the page is to be reloaded.
// Modern browsers require some interaction
// with the page, otherwise the dialog box
// is not shown.
