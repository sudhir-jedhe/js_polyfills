Your `pyramidComplete` function creates a pyramid pattern where the left and right sides of each row are padded with spaces. However, there's a small issue with how the white space is handled on the right side. The loop for adding the spaces to the right is off by one because it starts from `i + 1`, which will cause it to add unnecessary spaces after the pyramid shape.

To fix this, you only need to add spaces on the left side to center the pyramid, and you can remove the extra right-side spaces. Here’s the corrected version:

```javascript
let pyramidComplete = (rows) => {
  for (let i = 1; i <= rows; i++) {
    let str = "";

    // Add the white space to the left
    for (let k = 1; k <= rows - i; k++) {
      str += " ";
    }

    // Add the '*' for each row
    for (let j = 0; j != 2 * i - 1; j++) {
      str += "*";
    }

    // Print the pyramid pattern for each row
    console.log(str);
  }
};
```

### Explanation:
- **Left Spaces**: You add `(rows - i)` spaces to the left of each row to center-align the stars (`*`).
- **Stars**: For each row `i`, you add `2 * i - 1` stars to form the pyramid.
- **No Right Spaces**: There's no need to add spaces on the right side because the left spaces already center the pyramid.

### Example output for `pyramidComplete(5)`:

```
    *    
   ***   
  *****  
 ******* 
*********
```

This should work as expected!