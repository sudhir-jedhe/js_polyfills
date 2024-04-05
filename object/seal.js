let array = ["a", "b", "c"];
Object.seal(array);
array.length = 1; // Error here


 should be able to modify the existing properties or methods of the objects but cannot add a new one. Object.seal() can be used to achieve the same but it also marks all existing properties as non-configurable like we cannot delete them but just update their value if it is writable.

 const obj = {
    prop: 42
  };
  
  Object.seal(obj);
  obj.prop = 33;
  console.log(obj.prop);
  // 33
  
  delete obj.prop; // cannot delete when sealed
  console.log(obj.prop);
  // 33


  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  //Seal the object
  Object.seal(obj);
  
  obj.nested.a = 2;
  delete obj.nested.a;
  console.log(obj.nested.a);
  // undefined


  function deepSeal(object) {
    // Retrieve the property names defined on object
    let propNames = Object.getOwnPropertyNames(object);
  
    // Seal properties before Sealing self
    for (let name of propNames) {
      let value = object[name];
  
      object[name] = value && typeof value === "object" ? 
        deepSeal(value) : value;
    }
  
    return Object.seal(object);
  }

  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  //Seal the object
  deepSeal(obj);
  
  obj.nested.a = 2;
  delete obj.nested.a;
  console.log(obj.nested.a);
  // 2

  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  //Seal the object
  deepSeal(obj);
  
  console.log(Object.isSealed(obj));
  //true