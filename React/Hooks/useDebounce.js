import { useEffect, useState } from "react";
import { useEffect, useRef, useState } from "react";

// For a frequently changing value like text input you might want to debounce the changes.

// Implement useDebounce() to achieve this.

// function App() {
//   const [value, setValue] = useState(...)
//   // this value changes frequently, 
//   const debouncedValue = useDebounce(value, 1000)
//   // now it is debounced
// }



export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay);
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  return debounced
}


/*******************************************
 * 
 */


export function useDebounce<T>(value: T, delay: number) {
  // your code here
  const currentTimer = useRef<any>();
  const [val, setVal] = useState(value);
  useEffect(()=>{
    if(currentTimer.current){
      clearTimeout(currentTimer.current);
    }
    currentTimer.current = setTimeout(()=>{
      setVal(value)
    },delay)
    
  },[value])
  return val
}
// if you want to try your code on the right panel
// remember to export App() component like below
const list: Array<string> = []
  const throttledList: Array<string> = []
  let currentTime = 0
  export function App() {
    const [data, setData] = useState('A')
    const throttledData = useDebounce(data, 3)
    list.push(data + '@' + currentTime)
    throttledList.push(throttledData + '@' + currentTime)
    console.log(throttledList)
    return null
  }
