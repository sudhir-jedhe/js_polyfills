const person = {
  name: "prashant",
  age: 28,
  gender: "male",
};

const proxiedPerson = new Proxy(person, {
  get(obj, prop) {
    console.log(`${obj[prop]} is the value of the property ${prop}`);
    return obj[prop];
  },
  set(obj, prop, value) {
    // intercept get
    console.log(
      `The value of the ${prop} is about to change from ${obj[prop]} to ${value}`
    );
    obj[prop] = value;
  },
});

console.log(proxiedPerson.name);
// "prashant is the value of the property name"
// "prashant"

proxiedPerson.age = 29;
// "The value of the age is about to change from 28 to 29"

const person = {
  name: "prashant",
  age: 28,
  gender: "male",
};

const proxiedPerson = new Proxy(person, {
  get(obj, prop) {
    if (prop === "gender") {
      console.log("Gender is a write only property be exposed!");
    } else {
      return obj[prop];
    }
  },
  set(obj, prop, value) {
    if (prop === "age") {
      if (value < 18 || value > 50) {
        console.log("Age value should be between 18 and 50");
      } else {
        obj[prop] = value;
      }
    } else {
      obj[prop] = value;
    }
  },
});

console.log(proxiedPerson.gender);
// "Gender is a write only property be exposed!"
// undefined

proxiedPerson.age = 17;
// "Age value should be between 18 and 50"

console.log(proxiedPerson.age);
// 28


Using Reflect in Proxy in JavaScript
If you notice in the above example we are using square objects to update and access the object property value in the get() and set() methods.

While this works fine, proxies are often used with the Reflect which is an inbuilt object that we can use to get and set the property values;


const person = {
    name: "prashant",
    age: 28,
    gender: "male"
  };
  
  const proxiedPerson = new Proxy(person, {
    get(obj, prop){
      if(prop === "gender"){
        console.log("Gender is a write only property be exposed!");
      }else{
        return Reflect.get(obj, prop);
      }
    },
    set(obj, prop, value){
      if(prop === "age"){
        if(value < 18 || value > 50){
          console.log("Age value should be between 18 and 50");
        }else{
          Reflect.set(obj, prop, value);
        }    
      }else{
        Reflect.set(obj, prop, value);
      }
    }
  });
  
  console.log(proxiedPerson.gender);
  // "Gender is a write only property be exposed!"
  // undefined
  
  proxiedPerson.age = 17;
  // "Age value should be between 18 and 50"
  
  console.log(proxiedPerson.age);
  // 28