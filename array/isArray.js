function customIsArray(value) {
    // write your code below
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  


  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }


  let arr = [1, 2, 3];

Array.isArray(arr);
//true

Array.isArray('string');
//false

Array.isArray({abc: 'xyz'});
///false