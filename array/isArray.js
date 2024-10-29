function customIsArray(value) {
    // write your code below
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  