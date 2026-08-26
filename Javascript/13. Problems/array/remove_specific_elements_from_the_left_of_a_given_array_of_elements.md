*** copy remove_specific_elements_from_the_left_of_a_given_array_of_elements.md ***

```js
function fun(n) { 
    // Array 
    var arr = [2, 4, 5, 3, 6]; 
      
    // Find index of specified element which is n 
    var ind = arr.indexOf(n); 
      
    // And remove n from array 
    arr.splice(ind, 1); 
    document.getElementById("p").innerHTML =  
    "After remove element"; 
      
    // Final result after remove n from array 
    document.getElementById("gfg").innerHTML =  
    "[" + arr + "]"; 
  } 