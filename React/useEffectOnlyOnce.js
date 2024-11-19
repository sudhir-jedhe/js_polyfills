// In this tutorial, we will see how to run useEffect hook only on updates that is when the state or props change, rather than on the mount and unmount.

// As useEffect get invoked at three instances,

// On Mount or initial rendering.
// On update, if any dependency changes.
// On UnMount when the component is about to get removed.
// We can programmatically configure the useEffect hook by adding a condition to detect whether it is invoked on the initial render or not, if it is not the initial render then only run our code.


import {useState, useEffect, useRef} from "React";

const App = () => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
       isInitialMount.current = false;
    } else {
        //This code here is to be run on the update
    }
  });
  
  return <></>;
}