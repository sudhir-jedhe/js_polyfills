```js

// Define customConcat method if it doesn't already exist
if (!Array.prototype.customConcat) {
    Array.prototype.customConcat = function() {
        // Convert the current array to a new array
        var newArray = this.slice();

        // Loop through each argument passed to the customConcat method
        for (var i = 0; i < arguments.length; i++) {
            var item = arguments[i];

            // Check if the argument is an array
            if (Array.isArray(item)) {
                // Concatenate each item from the argument array to the new array
                for (var j = 0; j < item.length; j++) {
                    newArray.push(item[j]);
                }
            } else {
                // If the argument is not an array, simply push it to the new array
                newArray.push(item);
            }
        }

        // Return the concatenated array
        return newArray;
    };
}

// Example usage
const arr1 = [1, 2, 3];
const arr2 = [4, 5];
const arr3 = [6, 7, 8];

// Using customConcat to concatenate multiple arrays
const concatenatedArray = arr1.customConcat(arr2, arr3);
console.log(concatenatedArray); // Output: [1, 2, 3, 4, 5, 6, 7, 8]

```