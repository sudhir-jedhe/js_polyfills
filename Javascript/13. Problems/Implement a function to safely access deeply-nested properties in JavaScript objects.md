***  Implement a function to safely access deeply-nested properties in JavaScript objects.md ***

```js
function getNestedProperty(obj, path) {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  const keys = path.split('.');
  let currentObj = obj;

  for (const key of keys) {
    if (!currentObj.hasOwnProperty(key)) {
      return undefined;
    }

    currentObj = currentObj[key];
  }

  return currentObj;
}