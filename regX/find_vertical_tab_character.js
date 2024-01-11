function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\v/;
  let match4 = str1.search(regex4);
  if (match4 == -1) {
    console.log("No vertical tab character present. ");
  } else {
    console.log("Index of vertical tab character: " + match4);
  }
}
geek(); // No vertical tab character present.

/****************************** */
function geek() {
  let str1 = "123ge\veky456";
  let regex4 = new RegExp("\\v");
  let match4 = str1.search(regex4);
  console.log(" Index of vertical tab character: " + match4);
}
geek(); //  Index of vertical tab character: 5
