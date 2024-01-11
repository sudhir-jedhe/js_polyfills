function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\bgeeksforgeeks/gi;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " match: " + match4);
}
geek();
// matches the word “GeeksforGeeks” at the beginning of the string.
// Found 1 match: GeeksforGeeks

/********************************************* */

function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\bGeeky", "gi");
  let replace = "GFG";
  let match4 = str1.replace(regex4, replace);
  console.log(" New string: " + match4);
}
geek();
// matches the word “Geeky” at the beginning and replaces it with the word “GFG”.
//  New string: GFG@128
