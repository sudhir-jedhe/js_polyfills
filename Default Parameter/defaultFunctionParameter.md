In your code, you're calling the `sum` function with arguments `null` and `20`, and you're using default parameter values in the function definition. However, there's a subtle behavior here related to how JavaScript handles `null` and default parameters.

### The Code:

```javascript
function sum(a = 5, b = 7) {
    console.log(a + b);
}

sum(null, 20);
```

### What happens here?

1. **Default Parameters**:  
   The `sum` function has default values for parameters `a` and `b`:
   - If `a` is `undefined` when the function is called, it will default to `5`.
   - If `b` is `undefined`, it will default to `7`.

2. **Calling the function with `null` and `20`**:
   - When you call `sum(null, 20)`, you're explicitly passing `null` for `a` and `20` for `b`.
   - In JavaScript, the default value mechanism only kicks in if the argument is **`undefined`**, **not `null`**. 
   - `null` is considered a **valid value**, and it's **not replaced by the default value**. Thus, `a` will be `null`, and `b` will be `20`.

3. **Inside the function**:  
   - `a + 20` will be evaluated, where `a = null`. 
   - In JavaScript, **`null` is treated as `0` when used in arithmetic operations**. 
   - So, `null + 20` will be interpreted as `0 + 20`, which evaluates to `20`.

4. **Result**:  
   The result will be that `20` is logged to the console because `null + 20` evaluates to `20`.

### Output:

```javascript
20
```

### Explanation:

- **Default values** for function parameters only apply when the value is `undefined`. In this case, since `null` is passed explicitly, the default value for `a` is not used.
- JavaScript converts `null` to `0` when used in numeric operations (like addition), which is why `null + 7` gives `7`.

### What would happen if `undefined` were passed for `a`?

```javascript
sum(undefined, 20);  // This would use the default value of 5 for 'a'
```

- In this case, the result would be `5 + 20`, so it would log `25` to the console, because `undefined` would cause `a` to take the default value `5`.

### Summary:
- The default value mechanism in JavaScript only applies when the argument is `undefined`, not `null`.
- When `null` is passed, it is treated as a valid value, and JavaScript converts it to `0` when performing arithmetic operations like addition.