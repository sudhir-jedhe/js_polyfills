A race condition is a phenomenon in which if you are making multiple API calls or performing asynchronous operations, then there are chances that the UI can update/render in glitch as the later call may resolve first and the first API call may resolve later.

This result in a bug as the data is rendered inconsistently.

For example, let’s say you are rendering a todo item depending upon the id received to the component.

import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const App = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${props.id}`);
      resp = await resp.json();
      setData(resp);
    };

    fetchData();
  }, [props.id]);

  return <div>{data.title || "Hello World!"}</div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
Copy
Now in this, if the component receives multiple ids, then there is a high chance that the app will enter race condition and will render the data, depending upon which API call completes first.

We can fix this in two ways

Handling the race condition in useEffect hook using flag.
Cancelling the API request using AbortController().
Handling the race condition in useEffect hook using flag
As you may be aware that the useEffect is called on three instances majorly Mount, UnMount, and Update.

Thus when a component has initiated the API call and before its completion if the component receives a new id that will trigger re-rendering, in this case, we can use a boolean flag to decide if a state should update when the API call completes, or else if during the clean-up (i.e unmount) we can change the flag value, that will prevent the state update with that API call’s result.

import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const App = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    let flag = true;
    
    const fetchData = async () => {
      let resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${props.id}`);
      resp = await resp.json();
      
      if(flag){
        setData(resp);
      }
    };

    fetchData();
    
    () => {
      flag = false;
    }
  }, [props.id]);

  return <div>{data.title || "Hello World!"}</div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
Copy
Cancelling the API request using AbortController()
JavaScript web API’s have a method called AbortController. This AbortController has a property called signal that allows us to create an AbortSignal that can be associated with the Fetch API which provides an option to abort the API request.

With this during the clean-up when the component is about to unmount, we can invoke the abort to cancel the API request.

import React, { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const App = (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try{
        let resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${props.id}`,{
            signal: abortController.signal,
          });
        resp = await resp.json();
        setData(resp);
      }catch(error){
        // abort controller throws error when aborted
        // thus it needs to be handled
      }
    };

    fetchData();
    
    () => {
       abortController.abort();
    }
  }, [props.id]);

  return <div>{data.title || "Hello World!"}</div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
Copy
The AbortController can only work with the fetch request, for other asynchronous operations you can use the flag.

// Throttle on slow 2G in the developer tools and hit on the download button, later click on abort, the API call will terminate with the abort error.