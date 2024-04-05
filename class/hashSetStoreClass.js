const Store = function () {
  //store the data
  this.list = {};

  //set the key-value in list
  this.set = function (key, value) {
    this.list[key] = value;
  };

  //get the value of the given key
  this.get = function (key) {
    return this.list[key];
  };

  //check if key exists
  this.has = function (key) {
    return !!this.list[key];
  };
};


Input:
const store = new Store();
store.set('a', 10);
store.set('b', 20);
store.set('c', 30);
console.log(store.get('b'));
console.log(store.has('c'));
console.log(store.get('d'));
console.log(store.has('e'));

Output:
20
true
undefined
false