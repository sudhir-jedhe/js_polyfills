// 4. **Function constructor:**

//    In this approach, create any function and apply the new operator to create object instances.

function Person(name) {
  this.name = name;
  this.age = 21;
}
var object = new Person("Sudheer");
