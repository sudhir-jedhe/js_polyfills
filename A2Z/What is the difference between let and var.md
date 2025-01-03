
3. ### What is the difference between let and var

You can list out the differences in a tabular format

| var                                                         | let                                           |
| ----------------------------------------------------------- | --------------------------------------------- |
| It has been available from the beginning of JavaScript      | Introduced as part of ES6                     |
| It has function scope                                       | It has block scope                            |
| Variable declaration will be hoisted                        | Hoisted but not initialized                   |
| It is possible to re-declare the variable in the same scope | It is not possible to re-declare the variable |

Let's take an example to see the difference,

```javascript
function userDetails(username) {
if (username) {
console.log(salary); // undefined due to hoisting
console.log(age); // ReferenceError: Cannot access 'age' before initialization
let age = 30;
var salary = 10000;
}
console.log(salary); //10000 (accessible due to function scope)
console.log(age); //error: age is not defined(due to block scope)
}
userDetails("John");
```