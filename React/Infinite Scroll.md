// Infinite scroll or lazy loading is an optimization technique used as a pagination to load the next set of data once the user has scrolled through the existing one.

// To implement the infinite scroll, We will have to listen to the window’s scroll event and determine if the user has scrolled to the end.

// If the user has scrolled to the bottom, then perform the next set of actions like making the API call or updating the state.

// In the below example, we will render the list of 50 items, once the user has scrolled to the bottom, will add 50 more and this will keep the infinite scroll going.


import React, { useState, useRef, useEffect, Children } from 'https://esm.sh/react@18.2.0'
import ReactDOM from 'https://esm.sh/react-dom@18.2.0'

const App = () => {
  const [count, setCount] = useState(50);
  
  useEffect(() => {
    const onScroll = () => {
      // if scrolled to the bottom
      if(window.innerHeight + window.scrollY >= window.document.body.offsetHeight){
        // update the state
        setCount(count + 50);
      }
    }
    
    // scroll event
    window.addEventListener('scroll', onScroll);
    
    // memory cleanup, remove listener
    return () => window.removeEventListener('scroll', onScroll);
  }, [count]);
  
  // generate items
  const elements = [];
  for(let i = 0; i < count; i++){
    elements.push(<div key={i}>{i}</div>)
  }
  
  return <div>
    {elements}
  </div>;
}

ReactDOM.render(<App />, document.getElementById('root'));