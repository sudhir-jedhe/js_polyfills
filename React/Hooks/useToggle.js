import { useReducer } from "react";
import { useState } from "react";
import { useCallback, useState } from "react";

export function useToggle(on: boolean): [boolean, () => void] {
  const [onState, toggle] = useReducer((state) => !state, on);
  return [onState, toggle]
}


/*********************** */


export function useToggle(on: boolean): [boolean, () => void] {
  const [toggle, setToggle] = useState(on);
  const toggleHandler = () => setToggle(prevState => !prevState);
  return [toggle, toggleHandler]
}



/************************* */

export function useToggle(on: boolean): [boolean, () => void] {
  // your code here
  const [ onOrOff, setOnOrOff ] = useState(on);
  const toggle = useCallback(() => setOnOrOff(prev => !prev), []);
  return [ onOrOff, toggle ]
}
// if you want to try your code on the right panel
// remember to export App() component like below
// export function App() {
//   return <div>your app</div>
// }
