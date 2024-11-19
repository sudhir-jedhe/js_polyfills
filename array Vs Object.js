Learn what is the difference between an array and an object in Javascript.

Objects are the most powerful data type of the javascript as they are used in almost everything. Functions are object, Arrays are objects, Regular Expression are objects and of course objects are objects.

So what’s exactly the difference between the javascript object and array?
Objects
Objects are mutable data structure in javascript which is used to represent a ‘Thing’. This could be anything like cars, plants, person, community etc.

It stores the data in key value pair and the key can be anything except for undefined. The keys are iterable and can be accessed in any order.

const obj = {
   name: 'Prashant Yadav',
   age: '26',
   gender: 'Male',
   getDetails: function(){
      return `${this.name} is ${this.age} years old`;
   }
};

console.log(obj.name);
//"Prashant Yadav"

console.log(obj.age);
//"26"

console.log(obj.getDetails());
//"Prashant Yadav is 26 years old"
Copy
We can either use a dot operator followed by key name obj.name or a square bracket along with key in string format obj['name'] to access the value.

We can also delete the key from the object.

delete obj.name;

console.log(obj.name);
//undefined
Copy
If you don’t know the key and want to access all the values then you can loop through the object and get them.

for(const key in obj){
   //Check if keys are not inherited
   if(obj.hasOwnProperty(key)){
     console.log(obj[key]); 
   }
}

//"Prashant Yadav"
//"26"
//"Male"
//function(){
//  return `${this.name} is ${this.age} years old`;
//}
Copy
The object can be extended and the changes will be reflected in the whole prototype chain for other objects.

Arrays
Arrays are objects only in javascript. The major difference is that they store the data in an ordered collection in which the data can be accessed using a numerical index.

They are also mutable and data can be modified at any index. Indexes are zero based which means the first item is stored at Oth index, second at first and so on, last item is stored at n-1th index.

const arr = [12, 23, 34, 45, 56, 67];

console.log(arr[0]);
//12
Copy
We can also remove the item from the array using the delete operator, but instead of delete the index, what it does it replaces the value with undefined.

delete arr[1];

console.log(arr);
//[12, undefined, 34, 45, 56, 67]
Copy
So in order to remove the key we will need to slice the array.

Arrays are iterable and we can loop through each key and access its value.

for(let i = 0; i < arr.length; i++){
  console.log(arr[i]);
}

//12, 
//23, 
//34, 
//45, 
//56, 
//67
Copy
The problem with this is the length method does returns the count of total item in the array. Instead it returns the last index of the array.

So if the arrays element at 9th index and all other index are empty then we will have undefined at all remaining indexes.

const arr = [];
arr[99] = 22;
console.log(arr);
//[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 22]
Copy
When to use array and when to use object?
It is pretty simple if you have to store the data in order or in a sequence then use array otherwise you can use object for everything else.