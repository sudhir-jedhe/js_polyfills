// [0-9].
// /\d/g

function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\d/g;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();

// Found 3 matches: 1,2,3

/********************************************** */

function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\d", "g");
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
