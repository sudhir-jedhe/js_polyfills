Implement Builder design pattern in JavaScript
Builder design pattern helps to create the objects with only required values, for this, we can create a no-args constructor and then build the object step-by-step and then get the final result from it.


class Payment {
    constructor(currency = '₹', amount = 0) {
      this.currency = currency;
      this.amount = amount;
    }
   
    addAmount = function(val){
      this.amount += val;
   
      // returning the reference of the same object
      return this;
    }
   
    pay = function(){
      console.log(`${this.currency} ${this.amount}`);
    }
   }
   
   const p1 = new Payment();
   
   p1.addAmount(100).addAmount(200).addAmount(200).pay();
   // "₹ 500"

   /**
    * 
    * 
    * There should be a method for the object to terminate the chaining and return the result like we have the pay() as all the other methods are returning the reference of the object.

As the Builder design pattern helps to build the object step-by-step, we can create different versions of output of the same object without creating a new constructor every time, for example, I can do the payment in Rupees, Dollars, or Euros using the same object instance.
    */


class Payment {
    constructor(currency = '₹', amount = 0) {
      this.currency = currency;
      this.amount = amount;
    }
   
    addAmount = function(val){
      this.amount += val;
      return this;
    }
   
    addCurrency = function(currency){
      this.currency = currency;
      return this;
    }
   
    pay = function(){
      console.log(`${this.currency} ${this.amount}`);
    }
   }
   
   const p1 = new Payment();
   
   p1.addAmount(100).addAmount(200).addAmount(200).pay();
   //"₹ 500"
   
   p1.addAmount(200).addCurrency('$').pay();
   //"$ 700"



   const p1 = {
    currency: '₹',
    amount: 0,
    addAmount: function(val){
      this.amount += val;
      return this;
    },
    addCurrency: function(currency){
      this.currency = currency;
      return this;
    },
    pay: function(){
      console.log(`${this.currency} ${this.amount}`);
    }
   };
   
   p1.addAmount(100).addAmount(200).addAmount(200).pay();
   // "₹ 500"
   
   p1.addAmount(200).addCurrency('$').pay();
   // "$ 700"