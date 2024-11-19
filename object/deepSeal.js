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


  const obj = {
    prop: 42
  };
  
  Object.freeze(obj);
  
  obj.prop = 33;
  // Throws an error in strict mode
  
  console.log(obj.prop);
  // 42


  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  Object.freeze(obj);
  
  obj.nested.a = 33;
  // Updates the value
  
  console.log(obj.nested.a);
  // 33


  function deepFreeze(object) {
    // Retrieve the property names defined on object
    var propNames = Object.getOwnPropertyNames(object);
  
    // Freeze properties before freezing self
    for (let name of propNames) {
      let value = object[name];
  
      object[name] = value && typeof value === "object" ? 
        deepFreeze(value) : value;
    }
  
    return Object.freeze(object);
  }

  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  deepFreeze(obj);
  
  obj.nested.a = 33;
  // Updates the value
  
  console.log(obj.nested.a);
  // 1



  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  //Seal the object
  deepFreeze(obj);
  
  console.log(Object.isFrozen(obj));
  //true