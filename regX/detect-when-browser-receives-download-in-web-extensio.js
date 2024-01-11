/*
<!DOCTYPE html>
<html>

<head>
	<title>Download</title>
</head>

<body>
	<h1 style="color:green">GeekForGeeks</h1>
	<h3>
		How to detect when browser 
		receives download in web extension ?
	</h3>
	<a href="http://127.0.0.1:5501/base.html" download>
	Download
	</a>
</body>

</html>
*/
// App.js
function handleCreated(downloadItem) {
  console.log(downloadItem);
}
browser.downloads.onCreated.addListener(handleCreated);

// Object {
//     id: 7,
//     url: "http://127.0.0.1:5501/base.html",
//     referrer: "http://127.0.0.1:5501/base.html",
//     filename: "C:\\Users\\NIKHIL\\Downloads\\base.html",
//     incognito: false, cookieStoreId: "firefox-default",
//     danger: "safe",
//     mime: "text/html",
//     startTime: "2022-10-06T08:10:17.599Z",
//     endTime: null, ...
// }
