// A Singleton is an object which can only be instantiated one time. Repeated calls to its constructor return the same instance. This way one can ensure that they don't accidentally create multiple instances.

var object = new (function () {
  this.name = "Sudheer";
})();
