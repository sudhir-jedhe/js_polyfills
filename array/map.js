  /**
 *
  The map() method creates a new array with the results of calling a provided function on every element in the calling array

  Callback is invoked with three arguments:
  - the value of the element
  - the index of the element
  - the Array object being traversed
*/

Array.prototype.myMap = function(callback, thisArg) {
    var mapArray = [];
    for (let i = 0; i < this.length; i++) {
        let current = this[i];
        mapArray.push(callback.call(thisArg, current, i, this));
    }
    return mapArray;
};

const result = arr.customMap((elem) => {
    return 3 * elem;
  });
  
  console.log(result);


  

  /***************************************** */
  function map(array, func) {
    return reduce(array, function (result, item) {
      result.push(func(item));
      return result;
    }, []);
  }

  map([1, 2, 3, 4, 5], item => item + 1) // [ 2, 3, 4, 5, 6 ]

  /************************************** */
  const map = (array, func) =>
  reduce(array, (result, item) =>
    result.concat(func(item)), []);
    