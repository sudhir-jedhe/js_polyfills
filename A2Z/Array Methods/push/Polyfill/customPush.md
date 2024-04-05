```js


Array.prototype.customPush = function (elements) {
    for (let i = 0; i < elements.length; i++) {
      this[elements.length] = elements[i];
    }
    return this;
  };
  
const words = [];
words.customPush("pen");
words.customPush("pencil", "knife", "chair");

console.log(words);

```

```js
Array.prototype.customPush = function (...elements) {
  // Get the current length of the array
  const currentLength = this.length;

  // Add new elements to the end of the array
  for (let i = 0; i < elements.length; i++) {
    this[currentLength + i] = elements[i];
  }

  // Return the new length of the array
  return this.length;
};

// Example usage:
const numbers = [1, 2, 3];
const newLength = numbers.customPush(4, 5, 6);
```