function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\n/;
  let match4 = str1.search(regex4);
  if (match4 == -1) {
    console.log("No newline characters present. ");
  } else {
    console.log("Index of newline character: " + match4);
  }
}
geek();
/*********************************************** */
function geek() {
  let str1 = "123ge\neky456";
  let regex4 = new RegExp("\\n");
  let match4 = str1.search(regex4);
  console.log(" Index of newline character: " + match4);
}
geek();
