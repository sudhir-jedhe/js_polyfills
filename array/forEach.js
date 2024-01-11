
  /**
 *
  forEach() calls a provided callback function once for each element in an array in ascending order.
  It is not invoked for index properties that have been deleted or are uninitialized
  (i.e. on sparse arrays, see example below).

  Callback is invoked with three arguments:

  - the value of the element
  - the index of the element
  - the Array object being traversed

  ** Imp
  There is no way to stop or break a forEach() loop other than by throwing an exception.
  If you need such behavior, the forEach() method is the wrong tool.
 *
*/

Array.prototype.customForEach = function myEach(callback) {
    for (let index = 0; index < this.length; index++) {
        let current = this[index];
        if (Object.hasOwnProperty.call(this, index)) {
            callback(current, index, this);
        }
    }
};


/****************************** */
const words = ['pen', 'pencil', 'falcon', 'rock', 'sky', 'earth'];

words.forEach(e => console.log(e));

console.log('-------------------------');

words.forEach((e, idx) => console.log(`${e} has index ${idx}`));

/********************************************************** */
let vals = [1, 2, 3, 4, 5];

vals.forEach(e => console.log(e * e))
console.dir(vals);

console.log('----------------');

let vals2 = vals.map(e => e * e);
vals2.forEach(e => console.log(e));
console.dir(vals2);

/******************************* */
let stones = new Map([[1, "garnet"], [2, "topaz"],
    [3, "opal"], [4, "amethyst"]]);

stones.forEach((k, v) => {

    console.log(`${k}: ${v}`);
});


/*********************************************** */
let arr = ["apple", "mango", 
		"apple", "orange", "mango", "mango"]; 

function removeDuplicates(arr) { 
	let unique = []; 
	arr.forEach(element => { 
		if (!unique.includes(element)) { 
			unique.push(element); 
		} 
	}); 
	return unique; 
} 
console.log(removeDuplicates(arr));

/******************************************** */