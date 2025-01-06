Unary functions are a fundamental concept in programming where a function accepts exactly one argument. They are commonly used for simplifying operations and making code more readable. Here's a breakdown of the provided example:

### **Example of a Unary Function**

```javascript
const unaryFunction = (a) => console.log(a + 10); 
```

### **Explanation**

1. **Input**:
   - The function takes a single parameter `a`.

2. **Processing**:
   - It adds `10` to the value of `a`.

3. **Output**:
   - The result is printed to the console.

4. **Example Usage**:
   ```javascript
   unaryFunction(5); // Output: 15
   unaryFunction(20); // Output: 30
   ```

---

### **Why Unary Functions Are Useful**

1. **Functional Programming**:
   Unary functions simplify transformations in functional programming, where operations like `map`, `filter`, and `reduce` often rely on single-argument functions.

2. **Partial Application**:
   Unary functions can be easily used with partial application or currying.

3. **Higher-Order Functions**:
   Many higher-order functions, such as those that accept callbacks, prefer unary functions for simplicity.

---

### **Using Unary Functions with Arrays**

A unary function is particularly useful with methods like `map`.

```javascript
const numbers = [1, 2, 3, 4];
const addTen = (a) => a + 10;

const updatedNumbers = numbers.map(addTen); 
console.log(updatedNumbers); // Output: [11, 12, 13, 14]
```

### **Conclusion**

Unary functions are a simple yet powerful concept in JavaScript, widely used in both functional and procedural paradigms. Their concise nature makes them ideal for operations where only a single input is required.