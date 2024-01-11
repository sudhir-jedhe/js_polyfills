function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\0/;
  let match4 = str1.search(regex4);
  if (match4 == -1) {
    console.log("No Null characters present. ");
  } else {
    console.log("Index of Null character: " + match4);
  }
}
geek(); // No Null characters present.

/************************************************** */
function geek() {
  let str1 = "123ge\0eky456";
  let regex4 = new RegExp("\\0");
  let match4 = str1.search(regex4);
  console.log(" Index of NULL character: " + match4);
}
geek(); //  Index of NULL character: 5
