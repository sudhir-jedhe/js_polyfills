// What is the difference between an 

// Attributes are defined on the HTML markup whereas properties are defined on the DOM. For example, the below HTML element has 2 attributes type and value,


// <input type="text" value="Name:">


You can retrieve the attribute value as below,


const input = document.querySelector("input");
console.log(input.getAttribute("value")); // Good morning
console.log(input.value); // Good morning


// And after you change the value of the text field to "Good evening", it becomes like


console.log(input.getAttribute("value")); // Good evening
console.log(input.value); // Good evening