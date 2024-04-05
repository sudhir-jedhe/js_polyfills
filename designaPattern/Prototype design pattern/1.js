class Robot {
  constructor(name) {
    this.name = name;
  }

  fire() {
    return "phew phew";
  }
}

console.log(Robot);

const robo1 = new Robot("RoboCop");

console.log(robo1);


The instance object also holds a special property called __proto__ that points to the prototype of the constructor.

console.log(robo1.__proto__);





class Robot {
    constructor(name){
      this.name = name;
    }
  
    fire(){
      return 'phew phew';
    }
  };
  
  const robo1 = new Robot('RoboCop');
  const robo2 = new Robot('AutoBot');
  
  Robot.prototype.report = function(){
    console.log(`${this.name} reporting sir!`);
  }
  
  robo1.report();
  //RoboCop reporting sir!
  
  robo2.report();
  //AutoBot reporting sir!





  class Robot {
    constructor(name){
      // this.name = name;
    }
  
    fire(){
      return 'phew phew';
    }
  };
  
  const robo1 = new Robot('RoboCop');
  const robo2 = new Robot('AutoBot');
  
  Robot.prototype.report = function(){
    console.log(`${this.name} reporting sir!`);
  }
  
  Robot.prototype.name = "abc";
  
  robo1.report();
  //abc reporting sir!
  
  robo2.report();
  //abc reporting sir!



  class Robot {
    constructor(name){
      this.name = name;
    }
 
    fire(){
      return 'phew phew';
    }
 };
 
 class Transform extends Robot {
   constructor(name, nature){
     super(name);
     this.nature = nature;
   }
   
   getNature(){
     console.log(`I am ${this.nature}`);
   }
 }
 
 const robo1 = new Transform('RoboCop', 'good');
 const robo2 = new Transform('AutoBot', 'evil');
 
 Robot.prototype.report = function(){
   console.log(`${this.name} reporting sir!`);
 }
 
 robo1.report();
 //RoboCop reporting sir!
 
 robo2.report();
 //AutoBot reporting sir!