// 2. Write a code to make xmlHTTPRequest to get data from the server asynchronously
// XMLHttpRequest (XHR) objects are used to interact with server to retrieve data from a URL without having to do a full page refresh
// XHR requests can be initiated by creating the object and providing the arguments such as 'method', url etc
// The success and failure of the request can be managed by callbacks
const xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.onload = function () {
  console.log(this.response);
};
xhr.onerror = function () {
  console.log(this.statusText);
};
xhr.send();
