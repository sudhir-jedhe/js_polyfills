import { cssExports } from './../../../../Desktop/Project/React-TS/src/components/TicTacToe/ticTacToe.scss.d';
ES6

let const Arraow function Swap element Destruction, spread operaor, resizeTo
MAP Set Object, Class, Symbol, promise, default Parameter,
const fruits = new Map([
  ["apples", 500],
  ["bananas", 300],
  ["oranges", 200]
  ]);

  const fruits = new Map();

// Set Map Values
fruits.set("apples", 500);
fruits.set("bananas", 300);
fruits.set("oranges", 200);
fruits.get("apples");    // Returns 500

new Map()	Creates a new Map object
clear()	Removes all the elements from a Map
delete()	Removes a Map element specified by a key
entries()	Returns an iterator object with the [key, value] pairs in a Map
forEach()	Invokes a callback for each key/value pair in a Map
get()	Gets the value for a key in a Map
groupBy()	Groups object elements according to returned callback values
has()	Returns true if a key exists in a Map
keys()	Returns an iterator object with the keys in a Map
set()	Sets the value for a key in a Map
size	Returns the number of Map elements
values()	Returns an iterator object of the values in a Map
/*********************************************** */
const letters = new Set(["a","b","c"]);
// Add Variables to the Set
new Set()	Creates a new Set
add()	Adds a new element to the Set
clear()	Removes all elements from a Set
delete()	Removes an element from a Set
entries()	Returns an Iterator with the [value,value] pairs from a Set
forEach()	Invokes a callback for each element
has()	Returns true if a value exists
keys()	Same as values()
values()	Returns an Iterator with the values in a Set
***************************

Object VS Map
Not directly iterable	              Directly iterable
Do not have a size property             	Have a size property
Keys must be Strings (or Symbols)	     Keys can be any datatype
Keys are not well ordered           	Keys are ordered by insertion
Have default keys	                Do not have default keys

String Method include, StartWith End with, 
Array fromm FileSystemHandle, findIndex, Array.entries
import cssExports
/******************************************************************* */
Mounting
Mounting means putting elements into the DOM.

React has four built-in methods that gets called, in this order, when mounting a component:

constructor()
getDerivedStateFromProps()
render()
componentDidMount()
The render() method is required and will always be called, the others are optional and will be called if you define them.

constructor
The constructor() method is called before anything else, when the component is initiated, and it is the natural place to set up the initial state and other initial values.

The constructor() method is called with the props, as arguments, and you should always start by calling the super(props) before anything else, this will initiate the parent's constructor method and allows the component to inherit methods from its parent (React.Component).

Example:Get your own React.js Server
The constructor method is called, by React, every time you make a component:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  render() {
    return (
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));
 
 
 
 

getDerivedStateFromProps
The getDerivedStateFromProps() method is called right before rendering the element(s) in the DOM.

This is the natural place to set the state object based on the initial props.

It takes state as an argument, and returns an object with changes to the state.

The example below starts with the favorite color being "red", but the getDerivedStateFromProps() method updates the favorite color based on the favcol attribute:

Example:
The getDerivedStateFromProps method is called right before the render method:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  static getDerivedStateFromProps(props, state) {
    return {favoritecolor: props.favcol };
  }
  render() {
    return (
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
    );
  }
}

ReactDOM.render(<Header favcol="yellow"/>, document.getElementById('root')); 
 
 
 

render
The render() method is required, and is the method that actually outputs the HTML to the DOM.

Example:
A simple component with a simple render() method:

class Header extends React.Component {
  render() {
    return (
      <h1>This is the content of the Header component</h1>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));

componentDidMount
The componentDidMount() method is called after the component is rendered.

This is where you run statements that requires that the component is already placed in the DOM.

Example:
At first my favorite color is red, but give me a second, and it is yellow instead:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({favoritecolor: "yellow"})
    }, 1000)
  }
  render() {
    return (
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));
 
 
 
 
 

Updating
The next phase in the lifecycle is when a component is updated.

A component is updated whenever there is a change in the component's state or props.

React has five built-in methods that gets called, in this order, when a component is updated:

getDerivedStateFromProps()
shouldComponentUpdate()
render()
getSnapshotBeforeUpdate()
componentDidUpdate()
The render() method is required and will always be called, the others are optional and will be called if you define them.

getDerivedStateFromProps
Also at updates the getDerivedStateFromProps method is called. This is the first method that is called when a component gets updated.

This is still the natural place to set the state object based on the initial props.

The example below has a button that changes the favorite color to blue, but since the getDerivedStateFromProps() method is called, which updates the state with the color from the favcol attribute, the favorite color is still rendered as yellow:

Example:
If the component gets updated, the getDerivedStateFromProps() method is called:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  static getDerivedStateFromProps(props, state) {
    return {favoritecolor: props.favcol };
  }
  changeColor = () => {
    this.setState({favoritecolor: "blue"});
  }
  render() {
    return (
      <div>
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
      <button type="button" onClick={this.changeColor}>Change color</button>
      </div>
    );
  }
}

ReactDOM.render(<Header favcol="yellow"/>, document.getElementById('root'));
 
 
 

shouldComponentUpdate
In the shouldComponentUpdate() method you can return a Boolean value that specifies whether React should continue with the rendering or not.

The default value is true.

The example below shows what happens when the shouldComponentUpdate() method returns false:

Example:
Stop the component from rendering at any update:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  shouldComponentUpdate() {
    return false;
  }
  changeColor = () => {
    this.setState({favoritecolor: "blue"});
  }
  render() {
    return (
      <div>
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
      <button type="button" onClick={this.changeColor}>Change color</button>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));
 
 
 

Example:
Same example as above, but this time the shouldComponentUpdate() method returns true instead:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  shouldComponentUpdate() {
    return true;
  }
  changeColor = () => {
    this.setState({favoritecolor: "blue"});
  }
  render() {
    return (
      <div>
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
      <button type="button" onClick={this.changeColor}>Change color</button>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));
 

render
The render() method is of course called when a component gets updated, it has to re-render the HTML to the DOM, with the new changes.

The example below has a button that changes the favorite color to blue:

Example:
Click the button to make a change in the component's state:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  changeColor = () => {
    this.setState({favoritecolor: "blue"});
  }
  render() {
    return (
      <div>
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
      <button type="button" onClick={this.changeColor}>Change color</button>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));

getSnapshotBeforeUpdate
In the getSnapshotBeforeUpdate() method you have access to the props and state before the update, meaning that even after the update, you can check what the values were before the update.

If the getSnapshotBeforeUpdate() method is present, you should also include the componentDidUpdate() method, otherwise you will get an error.

The example below might seem complicated, but all it does is this:

When the component is mounting it is rendered with the favorite color "red".

When the component has been mounted, a timer changes the state, and after one second, the favorite color becomes "yellow".

This action triggers the update phase, and since this component has a getSnapshotBeforeUpdate() method, this method is executed, and writes a message to the empty DIV1 element.

Then the componentDidUpdate() method is executed and writes a message in the empty DIV2 element:

 

Example:
Use the getSnapshotBeforeUpdate() method to find out what the state object looked like before the update:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({favoritecolor: "yellow"})
    }, 1000)
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    document.getElementById("div1").innerHTML =
    "Before the update, the favorite was " + prevState.favoritecolor;
  }
  componentDidUpdate() {
    document.getElementById("div2").innerHTML =
    "The updated favorite is " + this.state.favoritecolor;
  }
  render() {
    return (
      <div>
        <h1>My Favorite Color is {this.state.favoritecolor}</h1>
        <div id="div1"></div>
        <div id="div2"></div>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));

componentDidUpdate
The componentDidUpdate method is called after the component is updated in the DOM.

The example below might seem complicated, but all it does is this:

When the component is mounting it is rendered with the favorite color "red".

When the component has been mounted, a timer changes the state, and the color becomes "yellow".

This action triggers the update phase, and since this component has a componentDidUpdate method, this method is executed and writes a message in the empty DIV element:

Example:
The componentDidUpdate method is called after the update has been rendered in the DOM:

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({favoritecolor: "yellow"})
    }, 1000)
  }
  componentDidUpdate() {
    document.getElementById("mydiv").innerHTML =
    "The updated favorite is " + this.state.favoritecolor;
  }
  render() {
    return (
      <div>
      <h1>My Favorite Color is {this.state.favoritecolor}</h1>
      <div id="mydiv"></div>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));

Unmounting
The next phase in the lifecycle is when a component is removed from the DOM, or unmounting as React likes to call it.

React has only one built-in method that gets called when a component is unmounted:

componentWillUnmount()
componentWillUnmount
The componentWillUnmount method is called when the component is about to be removed from the DOM.

Example:
Click the button to delete the header:

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: true};
  }
  delHeader = () => {
    this.setState({show: false});
  }
  render() {
    let myheader;
    if (this.state.show) {
      myheader = <Child />;
    };
    return (
      <div>
      {myheader}
      <button type="button" onClick={this.delHeader}>Delete Header</button>
      </div>
    );
  }
}

class Child extends React.Component {
  componentWillUnmount() {
    alert("The component named Header is about to be unmounted.");
  }
  render() {
    return (
      <h1>Hello World!</h1>
    );
  }
}

ReactDOM.render(<Container />, document.getElementById('root'));

/************************************************** */


Feature	useCallback	useMemo
Purpose	Memoizes functions to prevent unnecessary renders	Memoizes values to prevent unnecessary computations
Returns	Memoized version of the provided callback function	Memoized value computed by the provided function
Dependencies	List of dependencies (deps)	List of dependencies (deps)
Usage	const memoizedCallback = useCallback(callback, deps);	const memoizedValue = useMemo(() => computeValue(dep1, dep2), [dep1, dep2]);
When to Use	Use when passing callbacks to child components or to useEffect	Use when calculating a value derived from props or state
Example	```javascript	```javascript
const handleClick = useCallback(() => {	const memoizedValue = useMemo(() => {
console.log('Button clicked!');	return expensiveFunction(dep1, dep2);
}, []);	}, [dep1, dep2]);
<Button onClick={handleClick} />;	
```	```	


const incrementAge = useCallback(() => {
  setAge(age + 1)
}, [age])

const incrementSalary = useCallback(() => {
  setSalary(salary + 1000)
}, [salary])


const isEven = useMemo(() => {
  let i = 0
  while (i < 2000000000) i++
  return counterOne % 2 === 0
}, [counterOne])



useEffect(() => {
  //Runs on every render
});

useEffect(() => {
  //Runs only on the first render
}, []);


useEffect(() => {
  //Runs on the first render
  //And any time any dependency value changes
}, [prop, state]);


useEffect(() => {
  let timer = setTimeout(() => {
  setCount((count) => count + 1);
}, 1000);

return () => clearTimeout(timer)
}, []);



const [inputValue, setInputValue] = useState("");
const count = useRef(0);

useEffect(() => {
  count.current = count.current + 1;
});

return (
  <>
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />



    import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [url]);

  return [data];
};

export default useFetch;


What is the difference between useLayoutEffect and useEffect?
With useEffect , the callback is executed asynchronously after the 
component has rendered and the screen has been updated. useLayoutEffect ,
 on the other hand, fires synchronously after all DOM mutations 
 but before the browser has painted the changes.

 useLayoutEffect is useful when we need to make changes to the DOM and 
 want to ensure that the changes are visible to the user immediately 
 before they see anything else


/************************************************* */


1. Use Functional Components with Hooks
Benefits: Functional components are simpler and more lightweight than class components. Hooks like useState, useEffect, useMemo, and useCallback allow you to manage state and side effects directly within functional components.

Example:

jsx
Copy code
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(); // Example of using useEffect for data fetching
  }, []);

  const fetchData = async () => {
    // Fetch data from API
    const response = await fetch('https://api.example.com/data');
    const result = await response.json();
    setData(result);
  };

  return (
    <div>
      {data ? <p>{data}</p> : <p>Loading...</p>}
    </div>
  );
};

export default MyComponent;
2. Memoization with useMemo and useCallback
Benefits: Memoization prevents unnecessary re-renders by caching expensive calculations or callbacks.

Example:

jsx
Copy code
import React, { useMemo } from 'react';

const MyComponent = ({ dep1, dep2 }) => {
  const memoizedValue = useMemo(() => {
    return dep1 + dep2; // Example of expensive computation
  }, [dep1, dep2]);

  return (
    <div>
      <p>Memoized Value: {memoizedValue}</p>
    </div>
  );
};

export default MyComponent;
3. Virtualize Long Lists
Benefits: Render only the visible portion of large lists to improve initial render and scrolling performance.

Example: Use libraries like react-window or react-virtualized for efficient list rendering.

4. Avoid Reconciliation Bottlenecks
Avoid: Passing new objects or functions as props unnecessarily can trigger unnecessary re-renders in child components.

Use Memoization: Use React.memo or PureComponent (for class components) to prevent re-renders of functional or class components respectively unless their props have changed.

5. Optimize Images and Assets
Lazy Loading: Load images lazily using React.lazy and Suspense to improve initial load times.

Compression: Optimize image sizes and use formats like WebP for better compression.

6. Bundle Optimization
Code Splitting: Split your code into smaller chunks using dynamic imports or React.lazy to load only what's needed.

Tree Shaking: Ensure your bundler (like Webpack) removes unused code to reduce bundle size.

7. Production Build Optimization
Minification: Minify your JavaScript, CSS, and HTML files to reduce file sizes and improve load times.

Caching: Use browser caching strategies and service workers to cache assets for faster subsequent visits.

8. Performance Monitoring
DevTools: Use browser developer tools (like Chrome DevTools) to monitor performance, identify bottlenecks, and optimize rendering.
9. Server-Side Rendering (SSR) and Static Site Generation (SSG)
Benefits: SSR and SSG can improve initial load times and SEO by pre-rendering content on the server or at build time.
10. Properly Use React.memo and PureComponent




/****************************** */

InputArray = [1,2,3,5,8,13,21,34]
Output = 87 --> 15 -->6

function sumArrayDigits(arr) {
  // Step 1: Calculate sum of the array
  const sum = arr.reduce((acc, curr) => acc + curr, 0);
  
  // Step 2: Helper function to sum digits until we get a single digit
  function sumDigits(num) {
      let sum = num;
      while (sum >= 10) {
          sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      }
      return sum;
  }
  
  // Step 3: Return the single digit sum
  return sumDigits(sum);
}

// Example usage:
const arr = [1, 2, 3, 4, 5];
const singleDigitSum = sumArrayDigits(arr);
console.log(singleDigitSum); // Output: 1


import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // Import your combined reducers

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;


// Example async action using thunk
export const fetchUserProfile = () => {
  return async (dispatch) => {
    try {
      // Perform async operation (e.g., API call)
      const response = await fetch('https://api.example.com/profile');
      const data = await response.json();

      // Dispatch success action
      dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: data });
    } catch (error) {
      // Dispatch error action
      dispatch({ type: 'FETCH_PROFILE_FAILURE', error: error.message });
    }
  };
};

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers'; // Import your combined reducers
import rootSaga from './sagas'; // Import your root saga

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;

import { takeEvery, call, put } from 'redux-saga/effects';
import { fetchUserProfileSuccess, fetchUserProfileFailure } from './actions'; // Import your action creators

// Example saga function
function* fetchUserProfileSaga(action) {
  try {
    const response = yield call(fetch, 'https://api.example.com/profile');
    const data = yield response.json();
    yield put(fetchUserProfileSuccess(data));
  } catch (error) {
    yield put(fetchUserProfileFailure(error.message));
  }
}

// Root saga function
export default function* rootSaga() {
  yield takeEvery('FETCH_PROFILE_REQUEST', fetchUserProfileSaga);
  // Add more sagas as needed
}




// Action Types
const UPDATE_PROFILE = 'UPDATE_PROFILE';

// Action Creator
const updateProfile = (newProfile) => ({
  type: UPDATE_PROFILE,
  payload: newProfile,
});


const initialState = {
  empCode: 6,
  job: {
    profile: 'Developer',
    experience: '5 years',
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROFILE:
      return {
        ...state,
        job: {
          ...state.job,
          profile: action.payload,
        },
      };
    default:
      return state;
  }
};

import React from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from './actions'; // Assuming actions are defined in a separate file

const MyComponent = () => {
  const dispatch = useDispatch();

  const handleUpdateProfile = () => {
    dispatch(updateProfile('Tester'));
  };

  return (
    <div>
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default MyComponent;



Promise Object Properties
A JavaScript Promise object can be:

Pending
Fulfilled
Rejected
The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
The Promise object supports two properties: state and result.

While a Promise object is "pending" (working), the result is undefined.

When a Promise object is "fulfilled", the result is a value.

When a Promise object is "rejected", the result is an error object.

Promise.all()
Takes an iterable of promises as input and returns a single Promise.
 This returned promise fulfills when all of the input's promises fulfill 
 (including when an empty iterable is passed), with an array of the fulfillment values. It rejects when any of the input's promises reject, with this first rejection reason.

Promise.allSettled()
Takes an iterable of promises as input and returns a single Promise. 
This returned promise fulfills when all of the input's promises settle
 (including when an empty iterable is passed), with an array of objects that describe the outcome of each promise.

Promise.any()
Takes an iterable of promises as input and returns a single Promise. This returned promise fulfills when any of the input's promises fulfill, with this first fulfillment value. It rejects when all of the input's promises reject (including when an empty iterable is passed), with an AggregateError containing an array of rejection reasons.

Promise.race()
Takes an iterable of promises as input and returns a single Promise. This returned promise settles with the eventual state of the first promise that settles.

Promise.reject()
Returns a new Promise object that is rejected with the given reason.

Promise.resolve()
Returns a Promise object that is resolved with the given value. If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable, adopting its eventual state; otherwise, the returned promise will be fulfilled with the value.

Promise.withResolvers()
Returns an object containing a new Promise object and two functions to resolve or reject it, corresponding to the two parameters passed to the executor of the Promise() constructor.




/***************************************** */
"async and await make promises easier to write"

async makes a function return a Promise

await makes a function wait for a Promise



/****************************************/

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
        <RoleBasedRoute path="/admin" role="admin">
          <Admin />
        </RoleBasedRoute>
      </Switch>
    </Router>
  );
};

const Login = () => {
  // ...
};

const Home = () => {
  // ...
};

const Admin = () => {
  // ...
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const RoleBasedRoute = ({ children, role }) => {
  const isAuthenticated = useAuth();
  const userRole = getUserRole();

  if (!isAuthenticated || userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default App;