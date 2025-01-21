Passing data from a **child** component to a **parent** component in React is not as straightforward as passing data from **parent to child** via `props`, because React follows a **one-way data flow**. However, you can achieve this by using **callback functions**.

Here's a step-by-step explanation of how you can pass data from child to parent:

### 1. **Define a Callback Function in the Parent Component**
   - In the parent component, define a function that will handle the data passed from the child.
   
### 2. **Pass the Callback Function as a Prop to the Child**
   - Pass this callback function as a prop to the child component.

### 3. **Invoke the Callback Function in the Child**
   - In the child component, call the callback function (which was passed as a prop) and pass the data to the parent through the function's parameters.

### Example:

#### 1. **Parent Component**: (Handles the data from the child)
```jsx
import React, { useState } from 'react';
import Child from './Child';

const Parent = () => {
  const [message, setMessage] = useState('');

  // This is the callback function passed to the child
  const handleDataFromChild = (data) => {
    setMessage(data);  // Updating state with the data received from the child
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Message from Child: {message}</p>
      {/* Pass handleDataFromChild as a prop to the child */}
      <Child onSendData={handleDataFromChild} />
    </div>
  );
};

export default Parent;
```

#### 2. **Child Component**: (Sends data to the parent)
```jsx
import React, { useState } from 'react';

const Child = ({ onSendData }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendDataToParent = () => {
    onSendData(inputValue);  // Calling the parent function and passing the data
  };

  return (
    <div>
      <h2>Child Component</h2>
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        placeholder="Enter message"
      />
      <button onClick={sendDataToParent}>Send to Parent</button>
    </div>
  );
};

export default Child;
```

### How It Works:
1. In the **Parent Component**, we define the `handleDataFromChild` function, which updates the `message` state with the data passed from the child.
   
2. We then pass this function as a prop called `onSendData` to the **Child Component**.

3. Inside the **Child Component**, we call the `onSendData` function (which comes from the parent) and pass the data (in this case, the input value) when the button is clicked.

4. The data from the **child** (the input value) is passed to the **parent**, and the parent updates its state, which is then rendered on the page.

### Benefits of this Approach:
- **Separation of Concerns**: The child component does not need to know how to update the parent’s state, it simply informs the parent of changes via the callback.
- **Reusable Child Components**: The child component can be reused with different parent components, as long as the parent provides a callback for the child to communicate with.

### Conclusion:
Passing data from child to parent in React is achieved through the use of **callback functions**. By defining a function in the parent and passing it to the child as a prop, the child can call the function to send data back to the parent. This maintains React’s unidirectional data flow while still allowing communication from child to parent.