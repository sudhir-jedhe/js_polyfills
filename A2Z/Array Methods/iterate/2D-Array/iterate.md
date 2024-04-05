```js
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr[i].length; j++) {
    console.log(arr[i][j]);
  }
}

for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr[i].length; j++) {
    console.log(arr[i][j]);
  }
}

for (let rowArr of arr) {
  for (let value of rowArr) {
    console.log(value);
  }
}

arr.forEach((rowArr) => rowArr.forEach((val) => console.log(val)));
```