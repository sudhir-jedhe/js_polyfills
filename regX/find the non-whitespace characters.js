// [^\t\n\r]
function geek() {
  let str1 = "GeeksforGeeks @ _123_ $";
  let regex4 = /\S/g;
  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();

// Found 20 matches: G,e,e,k,s,f,o,r,G,e,e,k,s,@,_,1,2,3,_,$

/**************************************************** */

function geek() {
  let str1 = "Geeky@128";
  let regex4 = new RegExp("\\S", "g");

  let match4 = str1.match(regex4);

  console.log("Found " + match4.length + " matches: " + match4);
}
geek();

// Found 9 matches: G,e,e,k,y,@,1,2,8
