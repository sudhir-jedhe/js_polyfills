// /[^0-9]/

function geek() {
  let str1 = "123456790";
  let regex4 = /[^0-4]/g;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
// Found 4 matches: 5,6,7,9
/************************** */

function geek() {
  let str1 = "128@$%";
  let replacement = "#";
  let regex4 = new RegExp("[^0-9]", "g");
  let match4 = str1.replace(regex4, replacement);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();
// Found 6 matches: 128###
