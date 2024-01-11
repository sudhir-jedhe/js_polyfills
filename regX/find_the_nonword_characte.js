// not from a to z, A to Z, 0 to 9.
// [^a-zA-Z0-9].

function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\W/g;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();

// Found 2 matches: @,$

function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\W", "g");
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
// Found 1 matches: @
