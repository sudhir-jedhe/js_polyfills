
class Animal {
    constructor(legs) {
        this.legs = legs
    }

    sound() {
        console.log('Animal Sound')
    }
}

class Dog extends Animal {
    constructor(legs){
        super(legs)
    }

  

}

class Cat extends Animal {
    constructor(legs){
        super(legs)
    }
    sound() {
        console.log('Meow Meow')
    }
}


let cat = new Cat(4)
console.log(cat);



let dog = new Dog(4)
console.log(dog);
/********************************************************* */



class Employee {
#salary
  constructor(name, salary, skills) {
    console.log("constructor call on any instance");
    this.name = name,
    this.#salary=salary,
    this.skills = skills
  }
// instance methods
  displayName() {
    return this.name
  }

  get displayName() {
    return this.name;
  }

  set displayName(name) {
    this.name = name
  }

  get getSalary() {
    return this.#salary;
  }

  static parseJson(data) {
    const obj = JSON.parse(data)
    return new Employee(obj.name, obj.salary, obj.skills)
  }
}

let emp = new Employee('Sudhir', 200000, 'React JS');
console.log(emp);

console.log(emp.displayName()) // instance method
console.log(Employee.displayName()); // should not call on Class leve

let emp2 = Employee.parseJson('{"name": "sager", "salary": 25000, "skills": ["oracle", "PLSQL"]}')
console.log(emp2)

/**************************************************** */
// function expresion not hoisted
h()
let h =  () => {
    console.log('hello');
}

// class not hoisted
let em = new Evals()
class Evals() {}