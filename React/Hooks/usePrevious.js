import { useEffect, useRef } from "react";
import { useEffect, useRef, useState } from "react";

// When using hooks how do I get the previous value of props or state?
export function usePrevious<T>(value: T): T | undefined {
  /* The ref object is a generic container whose current property is mutable
  and can hold any value, similar to an instance property on a class */
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
// Ref: https://usehooks.com/usePrevious/



/*************** */


export function usePrevious<T>(value: T): T | undefined {
  const previous = useRef<T>();
  const toReturn = previous.current;
  previous.current = value;
  return toReturn;
}


// Create a hook usePrevious() to return the previous value, with initial previous value of undefined.