Array.prototype.lowerCase = function () {
  let i;
  for (i = 0; i < this.length; i++) {
    this[i] = this[i].toLowerCase();
  }
};

function myGeeks() {
  let sub = ["DSA", "WEBTEchnologies", "GeeksforGeeks", "gfg"];
  sub.lowerCase();

  console.log(sub);
}
myGeeks();
//[ 'dsa', 'webtechnologies', 'geeksforgeeks', 'gfg' ]
/********************************************** */
Array.prototype.stringLength = function () {
  let i;
  for (i = 0; i < this.length; i++) {
    this[i] = this[i].length;
  }
};

function lengthFunction() {
  let str = ["GeeksforGeeks", "GFG", "myGeeks"];
  str.stringLength();
  console.log(str);
}
lengthFunction();
