// characters from a to z, A to Z, 0 to 9.
// It is the same as [a-zA-Z_0-9].

function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\w/g;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
// Found 18 matches: G,e,e,k,s,f,o,r,G,e,e,k,s,_,1,2,3,_
/************************************************************ */
function geek() {
  let str1 = "128@$%";
  let replacement = "#";
  let regex4 = new RegExp("\\w", "g");
  let match4 = str1.replace(regex4, replacement);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();

// Found 6 matches: ###@$%
