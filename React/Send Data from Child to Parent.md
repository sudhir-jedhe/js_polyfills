### 39️⃣ **Practical: Send Data from Child to Parent using Callback Functions**

To send data from a child component to a parent component in React, you can use a callback function. This approach involves the parent passing a function to the child, which the child then calls to send data back to the parent.

#### Example:

1. **Parent Component**:

In the parent component, define a function that will handle the data passed from the child. Pass this function as a prop to the child component.

```jsx
import React, { useState } from 'react';
import Child from './Child';

function Parent() {
  const [dataFromChild, setDataFromChild] = useState('');

  // Callback function to receive data from the child
  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Data from Child: {dataFromChild}</p>
      <Child sendDataToParent={handleDataFromChild} />
    </div>
  );
}

export default Parent;
```

2. **Child Component**:

In the child component, call the function passed by the parent with the data you want to send back.

```jsx
import React, { useState } from 'react';

function Child({ sendDataToParent }) {
  const [inputData, setInputData] = useState('');

  const handleChange = (e) => {
    setInputData(e.target.value);
  };

  const sendData = () => {
    sendDataToParent(inputData); // Sending data back to parent
  };

  return (
    <div>
      <h2>Child Component</h2>
      <input 
        type="text" 
        value={inputData} 
        onChange={handleChange} 
        placeholder="Enter some data"
      />
      <button onClick={sendData}>Send to Parent</button>
    </div>
  );
}

export default Child;
```

#### Explanation:
- The parent component passes a callback function (`handleDataFromChild`) to the child.
- The child component calls the `sendDataToParent` function with the data when the user interacts with the input.
- The parent component updates its state with the data received from the child, causing the component to re-render with the new data.

---

### 4️⃣0️⃣ **Practical: Send Data from Child to Parent using `useRef`**

Another way to send data from a child to a parent in React is using `useRef`. `useRef` allows the parent to access the child component's state or data directly without relying on props or state changes.

#### Example:

1. **Parent Component**:

In the parent component, create a reference (`useRef`) to the child component and access a method or data from it.

```jsx
import React, { useRef, useState } from 'react';
import Child from './Child';

function Parent() {
  const childRef = useRef(null);
  const [dataFromChild, setDataFromChild] = useState('');

  const getDataFromChild = () => {
    // Access child method using ref
    const data = childRef.current.getData();
    setDataFromChild(data);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Data from Child: {dataFromChild}</p>
      <Child ref={childRef} />
      <button onClick={getDataFromChild}>Get Data from Child</button>
    </div>
  );
}

export default Parent;
```

2. **Child Component**:

In the child component, define a method that will return the data you want to send to the parent. Use `useImperativeHandle` to expose the method to the parent.

```jsx
import React, { useState, useImperativeHandle, forwardRef } from 'react';

const Child = forwardRef((props, ref) => {
  const [inputData, setInputData] = useState('');

  useImperativeHandle(ref, () => ({
    getData() {
      return inputData;
    },
  }));

  const handleChange = (e) => {
    setInputData(e.target.value);
  };

  return (
    <div>
      <h2>Child Component</h2>
      <input 
        type="text" 
        value={inputData} 
        onChange={handleChange} 
        placeholder="Enter some data"
      />
    </div>
  );
});

export default Child;
```

#### Explanation:
- In the parent, `useRef` is used to create a reference (`childRef`) to the child component.
- The `useImperativeHandle` hook is used inside the child to expose the `getData` method that allows the parent to access the child's data.
- The parent calls `childRef.current.getData()` to retrieve the data from the child when needed, such as when the user clicks a button.

---

### Summary:
- **Using callback functions**: Allows the child to send data to the parent by invoking a function passed down from the parent as a prop.
- **Using `useRef`**: Enables the parent to directly access methods or data in the child component without requiring state updates or prop passing.

Both approaches can be useful depending on the situation:
- If you need the child to explicitly send data to the parent as a result of user interaction, using callback functions is a common and straightforward pattern.
- If the parent needs to access the child’s data without triggering re-renders or using props, using `useRef` and `useImperativeHandle` can be more efficient.