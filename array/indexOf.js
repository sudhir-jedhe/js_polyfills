/*************************** Array For indexOf method ***************************/

Array.prototype.customIndexOf = function (value) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == value) {
        return i;
      }
    }
    return -1;
  };
  const arr = [1, 2, 3, 4, 5, 9, 7, 9, 9, 10];
  console.log(arr.customIndexOf(9));




  /****************************************** */

  let arr = ["apple", "mango", 
		"apple", "orange", "mango", "mango"]; 

function removeDuplicates(arr) { 
	let unique = []; 
	for (i = 0; i < arr.length; i++) { 
		if (unique.indexOf(arr[i]) === -1) { 
			unique.push(arr[i]); 
		} 
	} 
	return unique; 
} 
console.log(removeDuplicates(arr));
