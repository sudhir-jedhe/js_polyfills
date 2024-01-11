//           /\t/

function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\t/;
  let match4 = str1.search(regex4);
  if (match4 == -1) {
    console.log("No tab character present. ");
  } else {
    console.log("Index of tab character: " + match4);
  }
}
geek(); // No tab character present.


/********************************************* */
function geek() {
  let str1 = "123ge\teky456";
  let regex4 = new RegExp("\\t");
  let match4 = str1.search(regex4);

  console.log(" Index of tab character: " + match4);
}
geek();

Index of tab character: 5

