//words whose starting character is “A” and ending character is “C” with only one character in between them.
function geek() {
  let str1 = "ABC, A3C, A C, AXXCC!";
  let regex4 = /A.C/g;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
// Found 3 matches: ABC,A3C,A C

/******************************************* */
// searches the words having “a” as starting letter and “c” as ending the letter with only one character in between.
function geek() {
  let str1 = "ABC, A3X, a x, AXXCC!";
  let regex4 = new RegExp("a.x", "g");
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
// Found 1 matches: a x
