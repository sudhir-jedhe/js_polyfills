function geek() {
  let str1 = "GeeksforGeeks@_123_$";
  let regex4 = /\Bfor/gi;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " match: " + match4);
}
geek();
// Found 1 match: for
/******************* */

function geek() {
  let str1 = "123geeky456";
  let regex4 = new RegExp("\\Bgeeky", "gi");
  let replace = "GEEKY";
  let match4 = str1.replace(regex4, replace);
  console.log(" New string: " + match4);
}
geek();
//  New string: 123GEEKY456
