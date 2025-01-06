// Let us see how to create a useIdle() hook in React that will return the boolean value depending upon the active or inactive state of the user after a defined amount of time.

// In the last article, we had seen how to detect an idle state in React, we will be using the same approach but consolidate the logic in a hook so that it can be resued.

// A user is considered to be inactive or idle if he is not performing any sort of action using interaction hardware like a mouse, or keyboard for desktops and laptops and touch on mobile and tablets.

// For this, there are a set of events that we can listen to like mousemove, mousedown, keypress, DOMMouseScroll, mousewheel, touchmove, MSPointerMove.

// Also, we need to handle edge cases where the window or tab is out of focus, for which we will listen to the focus and blur events.

// If any of these events are triggered then set the user to be Active else if none of them have happened for a given amount of time then set the user to be Idle or Inactive.

// We will take duration as input for useIdle(delay) for which if the user is not performing any action then he will be considered as Idle.

// The logic to implement is straightforward, we will use a useState to monitor the user’s active status and useEffect to assign the event listeners on the window object as well as document and later remove the listeners during cleanup.

// Using useRef we will track a setTimeout that will change status if the user has not performed any action for the duration received as input, else clear the timer and start a fresh timeout.



import { useState, useEffect, useRef } from "react";

const useIdle = (delay) => {
  const [isIdle, setIsIdle] = useState(false);

  // create a new reference to track timer
  const timeoutId = useRef();

  // assign and remove the listeners
  useEffect(() => {
    setup();

    return () => {
      cleanUp();
    };
  });

  const startTimer = () => {
    // wait till delay time before calling goInactive
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    //reset the timer and make user active
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);

    // start the timer to track Inactiveness
    startTimer();
  };

  const setup = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("DOMMouseScroll", resetTimer, false);
    document.addEventListener("mousewheel", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("MSPointerMove", resetTimer, false);

    //edge case
    //if tab is changed or is out of focus
    window.addEventListener("blur", startTimer, false);
    window.addEventListener("focus", resetTimer, false);
  };

  const cleanUp = () => {
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("mousedown", resetTimer);
    document.removeEventListener("keypress", resetTimer);
    document.removeEventListener("DOMMouseScroll", resetTimer);
    document.removeEventListener("mousewheel", resetTimer);
    document.removeEventListener("touchmove", resetTimer);
    document.removeEventListener("MSPointerMove", resetTimer);

    //edge case
    //if tab is changed or is out of focus
    window.removeEventListener("blur", startTimer);
    window.removeEventListener("focus", resetTimer);

    // memory leak
    clearTimeout(timeoutId.current);
  };

  // return previous value (happens before update in useEffect above)
  return isIdle;
};




Input:
const Example = () => {
  const isIdle = useIdle(2000);

  return (
    <div>
      <h1>IsIdle: {isIdle ? "true" : "false"}</h1>
    </div>
  );
};

Output:
IsIdle: false
IsIdle: true // after 2 seconds




// If a user is Idle or not performing any type of activity then we can stop certain actions like API calls or perform session management and log out the user from the application, especially in the banking apps.

// If a user is not using interaction hardware, such as a mouse, keyboard, or touch screen on a desktop, laptop, or mobile device, then that user is said to be inactive or idle.

// We can listen to events like mousemove, mousedown, keypress, DOMMouseScroll, mousewheel, touchmove, and MSPointerMove for this.

// Additionally, we must deal with edge circumstances where the window or tab is out of focus, therefore we will listen for focus and blur events in these situations.

// If any of these events occur, set the user to be active; otherwise, if none have occurred for a predetermined period of time, set the user to be idle or inactive.

// useIdle() hook takes time as input and will notify if the user has not performed any activity for that given amount of time.

const useIdle = (delay) => {
  const [isIdle, setIsIdle] = useState(false);

  // create a new reference to track timer
  const timeoutId = useRef();

  // assign and remove the listeners
  useEffect(() => {
    setup();

    return () => {
      cleanUp();
    };
  });

  const startTimer = () => {
    // wait till delay time before calling goInactive
    timeoutId.current = setTimeout(goInactive, delay);
  };

  const resetTimer = () => {
    //reset the timer and make user active
    clearTimeout(timeoutId.current);
    goActive();
  };

  const goInactive = () => {
    setIsIdle(true);
  };

  const goActive = () => {
    setIsIdle(false);

    // start the timer to track Inactiveness
    startTimer();
  };

  const setup = () => {
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("DOMMouseScroll", resetTimer, false);
    document.addEventListener("mousewheel", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
    document.addEventListener("MSPointerMove", resetTimer, false);

    //edge case
    //if tab is changed or is out of focus
    window.addEventListener("blur", startTimer, false);
    window.addEventListener("focus", resetTimer, false);
  };

  const cleanUp = () => {
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("mousedown", resetTimer);
    document.removeEventListener("keypress", resetTimer);
    document.removeEventListener("DOMMouseScroll", resetTimer);
    document.removeEventListener("mousewheel", resetTimer);
    document.removeEventListener("touchmove", resetTimer);
    document.removeEventListener("MSPointerMove", resetTimer);

    //edge case
    //if tab is changed or is out of focus
    window.removeEventListener("blur", startTimer);
    window.removeEventListener("focus", resetTimer);

    // memory leak
    clearTimeout(timeoutId.current);
  };

  // return previous value (happens before update in useEffect above)
  return isIdle;
};